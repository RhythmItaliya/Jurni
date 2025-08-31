import { RegisterData } from '@/types/user';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

export interface RegistrationResponse {
  message: string;
  user: {
    uuid: string;
    username: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  otpInfo: {
    expiresIn: string;
    type: string;
  };
}

/**
 * Handle user registration
 * @param registerData - User registration data
 * @returns Registration result with success/error and user data
 */
export const handleRegister = async (
  registerData: RegisterData
): Promise<{
  success: boolean;
  data?: RegistrationResponse;
  error?: string;
}> => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, {
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Registration failed',
      };
    }

    return {
      success: false,
      error: 'Cannot connect to server. Please try again later.',
    };
  }
};

/**
 * Validate registration form
 * @param registerData - Form data to validate
 * @returns Validation result with errors
 */
export const validateRegisterForm = (registerData: RegisterData) => {
  const errors: string[] = [];

  if (!registerData.username || registerData.username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }

  if (!registerData.email || !isValidEmail(registerData.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!registerData.password || registerData.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (registerData.password !== registerData.confirmPassword) {
    errors.push('Passwords do not match');
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
export const formatRegisterError = (error: string): string => {
  return error || 'Registration failed. Please try again.';
};
