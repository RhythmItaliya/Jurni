/**
 * API Endpoints Configuration
 * Centralized management of all API endpoints
 * Matches client-side endpoints for consistency
 */

// Base endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    VERIFY_REGISTRATION_OTP: 'verify-registration-otp',
    RESEND_REGISTRATION_OTP: 'resend-registration-otp',
    UPDATE_TEMP_USER_EMAIL: 'update-temp-user-email',
    UPDATE_TEMP_USER_USERNAME: 'update-temp-user-username',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD: 'reset-password',
    VERIFY_RESET_TOKEN: 'verify-reset-token',
  },
  POSTS: {
    CREATE: 'create',
    LIST: 'list',
    DETAIL: (id: string) => `detail/${id}`,
    UPDATE: (id: string) => `update/${id}`,
    DELETE: (id: string) => `delete/${id}`,
  },
  COMMENTS: {
    CREATE: 'create',
    GET_BY_POST: 'list',
    UPDATE: (commentId: string) => `update/${commentId}`,
    DELETE: (commentId: string) => `delete/${commentId}`,
    LIKE: (commentId: string) => `like/${commentId}`,
  },
  LIKES: {
    LIKE: 'like',
    UNLIKE: (targetType: string, targetId: string) =>
      `unlike/${targetType}/${targetId}`,
    STATS: (targetType: string, targetId: string) =>
      `stats/${targetType}/${targetId}`,
    GET_LIKES: (targetType: string, targetId: string) =>
      `${targetType}/${targetId}`,
  },
  SAVEPOSTS: {
    SAVE: 'save',
    UNSAVE: (postId: string) => `unsave/${postId}`,
    STATS: (postId: string) => `stats/${postId}`,
    LIST: 'list',
  },
  PROFILES: {
    GET_BY_USERNAME: (username: string) => `${username}`,
    UPDATE: '',
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
export type SavePostsEndpointKey = keyof typeof ENDPOINTS.SAVEPOSTS;
export type ProfilesEndpointKey = keyof typeof ENDPOINTS.PROFILES;
