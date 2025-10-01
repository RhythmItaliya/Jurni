/**
 * Forgot password data interface
 * @interface ForgotPasswordData
 * @property {string} email - User's email address
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Validate forgot password form data
 * @param {ForgotPasswordData} data - Forgot password data to validate
 * @returns {Object} Validation result with errors
 * @returns {boolean} isValid - Whether form data is valid
 * @returns {string[]} errors - Array of validation error messages
 */
export const validateForgotPasswordForm = (data: ForgotPasswordData) => {
  const errors: string[] = [];

  if (!data.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format forgot password error messages for better user experience
 * @param {string} error - Raw error message from API
 * @returns {string} Formatted error message
 */
export const formatForgotPasswordError = (error: string) => {
  if (error.includes('email')) return 'Invalid email address';
  if (error.includes('not found')) return 'No account found with this email';
  if (error.includes('rate limit'))
    return 'Too many requests. Please try again later';
  return error;
};

/**
 * Check if input is a valid email format
 * @param {string} email - Email string to validate
 * @returns {boolean} Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
