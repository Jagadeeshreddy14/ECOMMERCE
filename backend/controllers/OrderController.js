const { sendMail } = require('../utils/Emails');
const { orderConfirmationEmail, orderStatusEmail } = require('../utils/emailTemplates');

exports.create = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      createdAt: new Date(),
      status: 'Pending'
    });
    
    const savedOrder = await order.save();
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

exports.updateById = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    )
    .populate('user')
    .populate({
      path: 'item.product',
      populate: { path: 'brand' }
    });

    if (req.body.status && ['Shipped', 'Delivered', 'Out for delivery'].includes(req.body.status)) {
      await sendMail(
        updated.user.email,
        'Order Status Update - Apex Store',
        orderStatusEmail(updated, updated.user)
      );
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({
      message: 'Error updating order',
      error: error.message
    });
  }
};