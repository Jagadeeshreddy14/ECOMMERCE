const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // Example user model
const router = express.Router();
const authController = require("../controllers/Auth");
const { verifyToken } = require('../middleware/VerifyToken');
const auth = require('../middleware/auth');

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
    .post('/google', async (req, res) => {
        try {
            const { credential } = req.body;

            // Verify Google token
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { email, name, sub } = payload;

            // Check if user exists in the database
            let user = await User.findOne({ email });
            if (!user) {
                // Create a new user if not found
                user = await User.create({
                    email,
                    name,
                    googleId: sub,
                    isVerified: true, // Assume Google users are verified
                });
            }

            // Return user details
            res.status(200).json({ user });
        } catch (error) {
            console.error('Google Authentication Error:', error);
            res.status(500).json({ message: 'Google authentication failed' });
        }
    })
    .post('/send-mobile-otp', auth, authController.sendMobileOTP)
    .post('/verify-mobile-otp', auth, authController.verifyMobileOTP);

module.exports = router;