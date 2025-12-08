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
  ADMIN: {
    AUTH: {
      LOGIN: 'login',
      REGISTER: 'register',
    },
    USERS: {
      GET_ALL: 'list',
      GET_BY_UUID: (uuid: string) => `${uuid}`,
      UPDATE: (uuid: string) => `${uuid}`,
      DELETE: (uuid: string) => `${uuid}`,
    },
  },
  POSTS: {
    CREATE: 'create',
    LIST: 'list',
    HASHTAG_POSTS: (hashtag: string) => `hashtag/${hashtag}`,
    MY_POSTS: 'my-posts',
    MY_SAVE_POSTS: 'my-save-posts',
    MY_LIKE_POSTS: 'my-like-posts',
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
    GET_ME: 'me',
    UPDATE: 'update',
    PUBLIC: (username: string) => `public/${username}`,
  },
  FOLLOWS: {
    FOLLOW: (userId: string) => `follow/${userId}`,
    UNFOLLOW: (userId: string) => `unfollow/${userId}`,
    FOLLOWERS: (userId: string) => `followers/${userId}`,
    FOLLOWING: (userId: string) => `following/${userId}`,
    STATUS: (userId: string) => `status/${userId}`,
  },
} as const;

// Helper function to build full URL
export const buildUrl = (endpoint: string, baseUrl?: string) => {
  return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
};

// Type for endpoint keys
export type EndpointKey = keyof typeof ENDPOINTS;
export type AuthEndpointKey = keyof typeof ENDPOINTS.AUTH;
export type AdminEndpointKey = keyof typeof ENDPOINTS.ADMIN;
export type AdminAuthEndpointKey = keyof typeof ENDPOINTS.ADMIN.AUTH;
export type PostsEndpointKey = keyof typeof ENDPOINTS.POSTS;
export type CommentsEndpointKey = keyof typeof ENDPOINTS.COMMENTS;
export type LikesEndpointKey = keyof typeof ENDPOINTS.LIKES;
export type SavePostsEndpointKey = keyof typeof ENDPOINTS.SAVEPOSTS;
export type ProfilesEndpointKey = keyof typeof ENDPOINTS.PROFILES;
export type FollowsEndpointKey = keyof typeof ENDPOINTS.FOLLOWS;
