const Coupon = require('../models/Coupon');

// Get all coupons
exports.getAll = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons', error: error.message });
  }
};

// Create new coupon
exports.create = async (req, res) => {
  try {
    // Check if coupon with same code exists
    const existingCoupon = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    // Validate dates
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    
    if (endDate < startDate) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const coupon = new Coupon({
      code: req.body.code.toUpperCase(),
      discountType: req.body.discountType,
      discountValue: req.body.discountValue,
      minPurchase: req.body.minPurchase,
      maxDiscount: req.body.maxDiscount,
      startDate: startDate,
      endDate: endDate
    });

    const savedCoupon = await coupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    res.status(400).json({ message: 'Error creating coupon', error: error.message });
  }
};

// Update coupon by ID
exports.updateById = async (req, res) => {
  try {
    // Validate dates
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    
    if (endDate < startDate) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check if updated code conflicts with existing coupons
    const existingCoupon = await Coupon.findOne({
      code: req.body.code.toUpperCase(),
      _id: { $ne: req.params.id }
    });
    
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        code: req.body.code.toUpperCase(),
        discountType: req.body.discountType,
        discountValue: req.body.discountValue,
        minPurchase: req.body.minPurchase,
        maxDiscount: req.body.maxDiscount,
        startDate: startDate,
        endDate: endDate
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json(updatedCoupon);
  } catch (error) {
    res.status(400).json({ message: 'Error updating coupon', error: error.message });
  }
};

// Delete coupon by ID
exports.deleteById = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coupon', error: error.message });
  }
};

// Validate coupon
exports.validate = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.body.code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return res.status(400).json({ message: 'Coupon has expired or not yet active' });
    }

    if (req.body.cartTotal && coupon.minPurchase > req.body.cartTotal) {
      return res.status(400).json({ 
        message: `Minimum purchase amount of ${coupon.minPurchase} required` 
      });
    }

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Error validating coupon', error: error.message });
  }
};