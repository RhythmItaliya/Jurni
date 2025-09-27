import { LoginCredentials } from '@/types/user';

/**
 * Validate login form data
 * @param {LoginCredentials} credentials - Login credentials to validate
 * @returns {Object} Validation result with errors
 * @returns {boolean} isValid - Whether form data is valid
 * @returns {string[]} errors - Array of validation error messages
 */
export const validateLoginForm = (credentials: LoginCredentials) => {
  const errors: string[] = [];

  if (!credentials.usernameOrEmail) {
    errors.push('Username or email is required');
  }

  if (!credentials.password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format login error messages for better user experience
 * @param {string} error - Raw error message from API
 * @returns {string} Formatted error message
 */
export const formatLoginError = (error: string) => {
  if (error.includes('Invalid credentials'))
    return 'Invalid username/email or password';
  if (error.includes('User not found')) return 'User not found';
  if (error.includes('Account not verified'))
    return 'Please verify your account first';
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
