const Coupon = require('../models/Coupon');

exports.validateCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;
  try {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(400).json({ valid: false, message: 'Invalid coupon' });
    }
    if (coupon.expiryDate < Date.now()) {
      return res.status(400).json({ valid: false, message: 'Coupon expired' });
    }
    if (cartTotal < coupon.minimumPurchase) {
      return res.status(400).json({ valid: false, message: 'Minimum purchase not met' });
    }
    res.json({ valid: true, coupon });
  } catch (error) {
    res.status(500).json({ valid: false, message: 'Server error' });
  }
};

exports.createCoupon = async (req, res) => {
  const { code, discountValue, discountType, expiryDate, maxDiscount, minimumPurchase } = req.body;
  try {
    const newCoupon = new Coupon({
      code,
      discountValue,
      discountType,
      expiryDate,
      maxDiscount,
      minimumPurchase,
    });
    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    console.error('Error creating coupon:', error); // Log the error details
    res.status(500).json({ message: 'Server error', error });
  }
};