import { signIn } from 'next-auth/react';
import { LoginCredentials } from '@/types/user';

/**
 * Handle user login
 * @param credentials - User login credentials
 * @returns Login result with success/error
 */
export const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const result = await signIn('credentials', {
      usernameOrEmail: credentials.usernameOrEmail,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
};

/**
 * Validate login form
 * @param credentials - Form data to validate
 * @returns Validation result with errors
 */
export const validateLoginForm = (credentials: LoginCredentials) => {
  const errors: string[] = [];

  if (!credentials.usernameOrEmail) {
    errors.push('Username or email is required');
  } else if (
    !isValidEmail(credentials.usernameOrEmail) &&
    credentials.usernameOrEmail.length < 3
  ) {
    errors.push('Please enter a valid username or email address');
  }

  if (!credentials.password) {
    errors.push('Password is required');
  } else if (credentials.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Check if email format is valid
 * @param email - Email to validate
 * @returns True if email format is valid
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format error message for display
 * @param error - Error message to format
 * @returns Formatted error message
 */
export const formatLoginError = (error: string): string => {
  // Show backend error messages directly
  if (
    error &&
    !error.includes('CredentialsSignin') &&
    !error.includes('AccessDenied')
  ) {
    return error;
  }

  // Handle NextAuth specific errors
  switch (error) {
    case 'CredentialsSignin':
      return 'Invalid email or password';
    case 'AccessDenied':
      return 'Access denied. Please check your credentials.';
    default:
      return error || 'Login failed. Please try again.';
  }
};
