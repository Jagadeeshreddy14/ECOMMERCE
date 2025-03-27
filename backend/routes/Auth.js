const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // Example user model
const router = express.Router();
const authController = require("../controllers/Auth");
const { verifyToken } = require('../middleware/VerifyToken');
const auth = require('../middleware/auth');
const passport = require('passport');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router
    .post("/signup", authController.signup)
    .post('/login', authController.login)
    .post("/verify-otp", authController.verifyOtp)
    .post("/resend-otp", authController.resendOtp)
    .post("/forgot-password", authController.forgotPassword)
    .post("/reset-password", authController.resetPassword)
    .get("/check-auth", verifyToken, authController.checkAuth)
    .get('/logout', authController.logout)
    .post('/google', authController.googleSignIn)
    .post('/send-mobile-otp', auth, authController.sendMobileOTP)
    .post('/verify-mobile-otp', auth, authController.verifyMobileOTP);

// Google Login Route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback Route
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const { token, user } = req.user;

    // Send the token and user data to the frontend
    res.redirect(`/login?token=${token}&name=${user.name}&email=${user.email}`);
  }
);

module.exports = router;