import { RegisterData } from '@/types/user';

/**
 * Validate registration form data
 * @param {RegisterData} data - Registration data to validate
 * @returns {Object} Validation result with errors
 * @returns {boolean} isValid - Whether form data is valid
 * @returns {string[]} errors - Array of validation error messages
 */
export const validateRegisterForm = (data: RegisterData) => {
  const errors: string[] = [];

  if (!data.username) {
    errors.push('Username is required');
  } else if (data.username.length < 3) {
    errors.push('Username must be at least 3 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  if (!data.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }

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
 * Format registration error messages for better user experience
 * @param {string} error - Raw error message from API
 * @returns {string} Formatted error message
 */
export const formatRegisterError = (error: string) => {
  if (error.includes('username')) return 'Username already exists';
  if (error.includes('email')) return 'Email already exists';
  if (error.includes('password')) return 'Invalid password';
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
