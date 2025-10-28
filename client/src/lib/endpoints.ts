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
  POSTS: {
    CREATE: '/posts/create',
    LIST: '/posts/list',
    DETAIL: (id: string) => `/posts/detail/${id}`,
    UPDATE: (id: string) => `/posts/update/${id}`,
    DELETE: (id: string) => `/posts/delete/${id}`,
  },
  COMMENTS: {
    CREATE: (postId: string) => `/posts/${postId}/comments/create`,
    GET_BY_POST: (postId: string) => `/posts/${postId}/comments/list`,
    UPDATE: (postId: string, commentId: string) =>
      `/posts/${postId}/comments/update/${commentId}`,
    DELETE: (postId: string, commentId: string) =>
      `/posts/${postId}/comments/delete/${commentId}`,
  },
  LIKES: {
    LIKE: '/likes/like',
    UNLIKE: (targetType: string, targetId: string) =>
      `/likes/unlike/${targetType}/${targetId}`,
    STATS: (targetType: string, targetId: string) =>
      `/likes/stats/${targetType}/${targetId}`,
    GET_LIKES: (targetType: string, targetId: string) =>
      `/likes/${targetType}/${targetId}`,
  },
} as const;

// Helper function to build full URL
export const buildUrl = (endpoint: string, baseUrl?: string) => {
  return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
};

// Type for endpoint keys
export type EndpointKey = keyof typeof ENDPOINTS;
export type AuthEndpointKey = keyof typeof ENDPOINTS.AUTH;
export type PostsEndpointKey = keyof typeof ENDPOINTS.POSTS;
export type CommentsEndpointKey = keyof typeof ENDPOINTS.COMMENTS;
export type LikesEndpointKey = keyof typeof ENDPOINTS.LIKES;
