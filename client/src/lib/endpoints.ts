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
  UPLOAD: {
    SINGLE: '/upload/single',
    MULTIPLE: '/upload/multiple',
    PROFILE: '/upload/profile',
    POST: '/upload/post',
    AUDIO: '/upload/audio',
    GENERATE_URL: '/upload/generate-url',
    DELETE: '/upload/file',
    HEALTH: '/upload/health',
    CONNECTION_INFO: '/upload/connection-info',
    STATS: '/upload/stats',
  },
  POSTS: {
    CREATE: '/posts',
    GET_ALL: '/posts',
    GET_BY_ID: (id: string) => `/posts/${id}`,
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    SAVE: (id: string) => `/posts/${id}/save`,
    SHARE: (id: string) => `/posts/${id}/share`,
    TRENDING_HASHTAGS: '/posts/trending-hashtags',
    SAVED: '/posts/saved',
    USER_POSTS: (userId: string) => `/posts/user/${userId}`,
  },
  COMMENTS: {
    CREATE: (postId: string) => `/posts/${postId}/comments`,
    GET_ALL: (postId: string) => `/posts/${postId}/comments`,
    UPDATE: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}`,
    DELETE: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}`,
    LIKE: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}/like`,
    REPLY: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}/reply`,
  },
} as const;

// Helper function to build full URL
export const buildUrl = (endpoint: string, baseUrl?: string) => {
  return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
};

// Type for endpoint keys
export type EndpointKey = keyof typeof ENDPOINTS;
export type AuthEndpointKey = keyof typeof ENDPOINTS.AUTH;
export type UploadEndpointKey = keyof typeof ENDPOINTS.UPLOAD;
export type PostsEndpointKey = keyof typeof ENDPOINTS.POSTS;
export type CommentsEndpointKey = keyof typeof ENDPOINTS.COMMENTS;
