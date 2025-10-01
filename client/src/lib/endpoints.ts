/**
 * API Endpoints Configuration
 * Centralized management of all API endpoints
 */

// Base endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_REGISTRATION_OTP: '/auth/verify-registration-otp',
    RESEND_REGISTRATION_OTP: '/auth/resend-registration-otp',
    UPDATE_TEMP_USER_EMAIL: '/auth/update-temp-user-email',
    UPDATE_TEMP_USER_USERNAME: '/auth/update-temp-user-username',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_RESET_TOKEN: '/auth/verify-reset-token',
  },
} as const;

// Helper function to build full URL
export const buildUrl = (endpoint: string, baseUrl?: string) => {
  return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
};

// Type for endpoint keys
export type EndpointKey = keyof typeof ENDPOINTS;
export type AuthEndpointKey = keyof typeof ENDPOINTS.AUTH;
