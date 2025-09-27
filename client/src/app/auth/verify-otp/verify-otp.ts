/**
 * OTP verification data interface
 * @interface VerifyOTPData
 * @property {string} email - User's email address
 * @property {string} otp - 6-character OTP code
 */
export interface VerifyOTPData {
  email: string;
  otp: string;
}

/**
 * Validate OTP form data
 * @param {string} otp - OTP string to validate
 * @returns {Object} Validation result with error message
 * @returns {boolean} isValid - Whether OTP is valid
 * @returns {string} [error] - Error message if invalid
 */
export const validateOTPForm = (otp: string) => {
  if (!otp || otp.length !== 6) {
    return { isValid: false, error: 'OTP must be 6 characters' };
  }

  if (!/^[A-Za-z0-9]{6}$/.test(otp)) {
    return {
      isValid: false,
      error: 'OTP must contain only letters and numbers',
    };
  }

  return { isValid: true };
};

/**
 * Format OTP error messages for better user experience
 * @param {string} error - Raw error message from API
 * @returns {string} Formatted error message
 */
export const formatOTPError = (error: string) => {
  if (error.includes('Invalid OTP')) return 'Invalid OTP code';
  if (error.includes('OTP expired'))
    return 'OTP has expired. Please request a new one';
  if (error.includes('User not found'))
    return 'User not found. Please register again';
  return error;
};
