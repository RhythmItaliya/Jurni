/**
 * Reset password data interface
 * @interface ResetPasswordData
 * @property {string} password - New password
 * @property {string} confirmPassword - Confirm new password
 */
export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

/**
 * Validate reset password form data
 * @param {ResetPasswordData} data - Reset password data to validate
 * @returns {Object} Validation result with errors
 * @returns {boolean} isValid - Whether form data is valid
 * @returns {string[]} errors - Array of validation error messages
 */
export const validateResetPasswordForm = (data: ResetPasswordData) => {
  const errors: string[] = [];

  if (!data.password) {
    errors.push('Password is required');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (data.password !== data.confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format reset password error messages for better user experience
 * @param {string} error - Raw error message from API
 * @returns {string} Formatted error message
 */
export const formatResetPasswordError = (error: string) => {
  if (error.includes('Invalid token')) return 'Invalid or expired reset link';
  if (error.includes('Token expired'))
    return 'Reset link has expired. Please request a new one';
  if (error.includes('password')) return 'Password does not meet requirements';
  if (error.includes('not found')) return 'Reset link is invalid';
  return error;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with detailed feedback
 * @returns {boolean} isValid - Whether password meets requirements
 * @returns {string[]} errors - Array of specific password requirements not met
 */
export const validatePasswordStrength = (password: string) => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
