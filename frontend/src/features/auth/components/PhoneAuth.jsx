import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert
} from '@mui/material';
import { initRecaptcha, signInWithPhone, verifyOTP } from '../../../services/firebaseAuth';

export const PhoneAuth = ({ open, onClose, onSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const recaptchaVerifierRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        const initializeRecaptcha = async () => {
            if (open && mounted) {
                try {
                    // Wait for a short delay to ensure the button is rendered
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    const verifier = initRecaptcha('phone-auth-button');
                    if (mounted) {
                        recaptchaVerifierRef.current = verifier;
                    }
                } catch (error) {
                    console.error('reCAPTCHA initialization error:', error);
                    if (mounted) {
                        setError('Failed to initialize verification. Please try again.');
                    }
                }
            }
        };

        initializeRecaptcha();

        return () => {
            mounted = false;
            if (recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current.clear();
            }
        };
    }, [open]);

    const handleSendOtp = async () => {
        try {
            setLoading(true);
            setError('');
            
            if (!recaptchaVerifierRef.current) {
                // Try to reinitialize reCAPTCHA if it's not available
                recaptchaVerifierRef.current = initRecaptcha('phone-auth-button');
            }

            const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
            const confirmation = await signInWithPhone(formattedPhoneNumber, recaptchaVerifierRef.current);
            setConfirmationResult(confirmation);
            setShowOtpField(true);
        } catch (error) {
            console.error('Send OTP error:', error);
            setError(error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            setError('');
            const user = await verifyOTP(confirmationResult, otp);
            onSuccess(user);
            handleClose();
        } catch (error) {
            console.error('Verify OTP error:', error);
            setError(error.message || 'Failed to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPhoneNumber('');
        setOtp('');
        setShowOtpField(false);
        setError('');
        if (recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current.clear();
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Phone Number Verification</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {!showOtpField ? (
                        <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+1234567890"
                            disabled={loading}
                            helperText="Enter your phone number with country code (e.g., +1234567890)"
                        />
                    ) : (
                        <TextField
                            fullWidth
                            label="OTP"
                            variant="outlined"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            disabled={loading}
                            helperText="Enter the verification code sent to your phone"
                        />
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    id="phone-auth-button"
                    onClick={!showOtpField ? handleSendOtp : handleVerifyOtp}
                    variant="contained"
                    disabled={loading || (!showOtpField && !phoneNumber) || (showOtpField && !otp)}
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : !showOtpField ? (
                        'Send OTP'
                    ) : (
                        'Verify OTP'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 