const express = require('express');
const router = express.Router();
const { validateCoupon, createCoupon,getCoupons  } = require('../controllers/couponsController');


router.post('/validate', validateCoupon);
router.post('/', createCoupon); // Add this line to handle coupon creation
router.get('/coupons', getCoupons);

module.exports = router;