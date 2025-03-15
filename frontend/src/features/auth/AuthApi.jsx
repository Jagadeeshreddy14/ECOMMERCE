import { axiosi } from "../../config/axios"; // ✅ Correct Import

// Function to safely extract error message
const handleError = (error) => {
    return error?.response?.data || { message: "Something went wrong" };
};

// ✅ Signup API
export const signup = async (cred) => {
    try {
        const res = await axiosi.post("auth/signup", cred);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

// ✅ Login API
export const login = async (cred) => {
    try {
        const res = await axiosi.post("auth/login", cred);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

// ✅ OTP Verification API
export const verifyOtp = async (cred) => {
    try {
        const res = await axiosi.post("auth/verify-otp", cred);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

// ✅ Resend OTP API
export const resendOtp = async (cred) => {
    try {
        const res = await axiosi.post("auth/resend-otp", cred);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

// ✅ Forgot Password API
export const forgotPassword = async (cred) => {
    try {
        const res = await axiosi.post("auth/forgot-password", cred);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

// ✅ Reset Password API
export const resetPassword = async (cred) => {
    try {
        const res = await axiosi.post("auth/reset-password", cred);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

// ✅ Check Authentication API
export const checkAuth = async () => {
    try {
        const res = await axiosi.get("auth/check-auth");
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

// ✅ Logout API
export const logout = async () => {
    try {
        const res = await axiosi.get("auth/logout");
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

// Add to AuthApi.jsx
export const sendMobileOtp = async (mobile) => {
    try {
        const res = await axiosi.post("auth/send-mobile-otp", { mobile });
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};

export const verifyMobileOtp = async (data) => {
    try {
        const res = await axiosi.post("auth/verify-mobile-otp", data);
        return res.data;
    } catch (error) {
        throw handleError(error);
    }
};
