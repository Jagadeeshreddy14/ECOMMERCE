const express = require('express');
const router = express.Router();
const { validateCoupon, createCoupon } = require('../controllers/couponsController');

router.post('/validate', validateCoupon);
router.post('/', createCoupon); // Add this line to handle coupon creation

module.exports = router;