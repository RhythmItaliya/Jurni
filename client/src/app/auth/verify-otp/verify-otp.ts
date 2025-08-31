import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface ResendOTPResponse {
  message: string;
  email: string;
  username: string;
  otpInfo: {
    expiresIn: string;
    type: string;
  };
}

/**
 * Handle OTP verification for registration
 * @param verifyData - Email and OTP data
 * @returns Promise with verification result
 */
export const handleVerifyOTP = async (verifyData: VerifyOTPData) => {
  try {
    const response = await api.post(
      ENDPOINTS.AUTH.VERIFY_REGISTRATION_OTP,
      verifyData
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    // Use only direct backend error responses
    return {
      success: false,
      error: error.response?.data?.message || 'Verification failed',
    };
  }
};

/**
 * Handle resend OTP request
 * @param email - User email address
 * @returns Promise with resend result
 */
export const handleResendOTP = async (email: string) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.RESEND_REGISTRATION_OTP, {
      email,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    // Use only direct backend error responses
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to resend OTP',
    };
  }
};

/**
 * Validate OTP form data
 * @param otp - 6-character OTP string
 * @returns Validation result object
 */
export const validateOTPForm = (otp: string) => {
  if (!otp || otp.length !== 6) {
    return { isValid: false, error: 'Please enter the 6-character OTP' };
  }

  // Check if OTP contains only valid characters (A-Z, 0-9)
  const validOTPRegex = /^[A-Z0-9]{6}$/;
  if (!validOTPRegex.test(otp)) {
    return { isValid: false, error: 'OTP must be 6 characters (A-Z, 0-9)' };
  }

  return { isValid: true, error: '' };
};
