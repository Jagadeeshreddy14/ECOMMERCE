const Order = require("../models/Order");
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { sendMail } = require('../utils/Emails');
const { orderConfirmationEmail, orderStatusEmail } = require('../utils/emailTemplates');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Error creating Razorpay order' });
  }
};

// Create order in database
exports.create = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      createdAt: new Date(),
      paymentStatus: req.body.paymentMode === 'COD' ? 'Pending' : 'Processing'
    });
    
    const savedOrder = await order.save();
    
    // Populate necessary fields
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user')
      .populate({
        path: 'item.product',
        populate: { path: 'brand' }
      });

    // Send order confirmation email
    await sendMail(
      populatedOrder.user.email,
      'Order Confirmation - Apex Store',
      orderConfirmationEmail(populatedOrder, populatedOrder.user)
    );

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ 
        message: "Invalid payment signature" 
      });
    }

    // Update order payment status
    await Order.findByIdAndUpdate(
      orderId,
      { 
        paymentStatus: 'Completed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      },
      { new: true }
    );

    res.status(200).json({ 
      message: "Payment verified successfully" 
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      message: "Payment verification failed",
      error: error.message
    });
  }
};

exports.getByUserId=async(req,res)=>{
    try {
        const {id}=req.params
        const results=await Order.find({user:id})
        res.status(200).json(results)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error fetching orders, please trying again later'})
    }
}

exports.getAll = async (req, res) => {
    try {
        let skip=0
        let limit=0

        if(req.query.page && req.query.limit){
            const pageSize=req.query.limit
            const page=req.query.page
            skip=pageSize*(page-1)
            limit=pageSize
        }

        const totalDocs=await Order.find({}).countDocuments().exec()
        const results=await Order.find({}).skip(skip).limit(limit).exec()

        res.header("X-Total-Count",totalDocs)
        res.status(200).json(results)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error fetching orders, please try again later'})
    }
};

exports.updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const updated=await Order.findByIdAndUpdate(id,req.body,{new:true})
          .populate('user')
          .populate({
            path: 'item.product',
            populate: { path: 'brand' }
          });

        // Send status update email if status changed to Delivered
        if (req.body.status === 'Delivered' || req.body.status === 'Out for delivery') {
          await sendMail(
            updated.user.email,
            'Order Status Update - Apex Store',
            orderStatusEmail(updated, updated.user)
          );
        }

        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error updating order, please try again later'})
    }
};

exports.createReturnRequest = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const images = req.files?.map(file => file.path);

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({ message: 'Order must be delivered before requesting return' });
    }

    // Check if within return window (7 days)
    const deliveryDate = new Date(order.updatedAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - deliveryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return res.status(400).json({ message: 'Return window has expired' });
    }

    order.status = 'Return Requested';
    order.returnRequest = {
      status: 'Requested',
      reason,
      images: images || [],
      requestDate: new Date()
    };

    await order.save();
    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: 'Error processing return request' });
  }
};

exports.createOrder = async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { items, ...orderData } = req.body;

            // Check stock for all items
            for (const item of items) {
                const product = await Product.findById(item.product);
                if (!product || product.stock.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.title}`);
                }
            }

            // Create order
            const order = new Order({
                ...orderData,
                items,
                user: req.user._id
            });

            // Update stock for each item
            for (const item of items) {
                const product = await Product.findById(item.product);
                await product.updateStock(item.quantity, 'remove', 'order');
            }

            await order.save({ session });
            await session.commitTransaction();

            res.status(201).json(order);
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) throw new Error('Order not found');

        // Restore stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            await product.updateStock(item.quantity, 'add', 'order-cancel');
        }

        order.status = 'Cancelled';
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
