import { 
    signInWithPopup, 
    signInWithPhoneNumber, 
    RecaptchaVerifier 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

// Initialize reCAPTCHA verifier
export const initRecaptcha = (buttonId) => {
    if (!buttonId) {
        throw new Error('Button ID is required for reCAPTCHA initialization');
    }

    // Clear any existing reCAPTCHA
    if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
    }

    // Create new reCAPTCHA verifier
    window.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
        size: 'invisible',
        callback: () => {
            // reCAPTCHA solved
            console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
            // Response expired
            console.log('reCAPTCHA expired');
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
        }
    });

    return window.recaptchaVerifier;
};

// Phone number authentication
export const signInWithPhone = async (phoneNumber, recaptchaVerifier) => {
    if (!phoneNumber) {
        throw new Error('Phone number is required');
    }

    if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA verifier is required');
    }

    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
        return confirmationResult;
    } catch (error) {
        console.error('Phone sign-in error:', error);
        throw new Error(error.message || 'Failed to send verification code');
    }
};

// Verify OTP
export const verifyOTP = async (confirmationResult, otp) => {
    if (!confirmationResult) {
        throw new Error('Confirmation result is required');
    }

    if (!otp) {
        throw new Error('OTP is required');
    }

    try {
        const userCredential = await confirmationResult.confirm(otp);
        return userCredential.user;
    } catch (error) {
        console.error('OTP verification error:', error);
        throw new Error(error.message || 'Failed to verify OTP');
    }
};

// Google Sign In
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error('Google sign-in error:', error);
        throw new Error(error.message || 'Failed to sign in with Google');
    }
};

// Sign Out
export const signOut = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Sign out error:', error);
        throw new Error(error.message || 'Failed to sign out');
    }
};

// Get current user
export const getCurrentUser = () => {
    return auth.currentUser;
}; 