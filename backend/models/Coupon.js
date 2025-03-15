const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountValue: { type: Number, required: true },
  discountType: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  maxDiscount: { type: Number, required: true },
  minimumPurchase: { type: Number, required: true },
});

module.exports = mongoose.model('Coupon', couponSchema);