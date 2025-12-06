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
    HASHTAG_POSTS: (hashtag: string) => `/posts/hashtag/${hashtag}`,
    MY_POSTS: '/posts/my-posts',
    MY_SAVE_POSTS: '/posts/my-save-posts',
    MY_LIKE_POSTS: '/posts/my-like-posts',
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
  SAVEPOSTS: {
    SAVE: '/saveposts/save',
    UNSAVE: (postId: string) => `/saveposts/unsave/${postId}`,
    STATS: (postId: string) => `/saveposts/stats/${postId}`,
    LIST: '/saveposts/list',
  },
  PROFILES: {
    GET_ME: '/profiles/me',
    UPDATE: '/profiles/update',
    PUBLIC: (username: string) => `/profiles/public/${username}`,
  },
  FOLLOWS: {
    FOLLOW: (userId: string) => `/follows/follow/${userId}`,
    UNFOLLOW: (userId: string) => `/follows/unfollow/${userId}`,
    FOLLOWERS: (userId: string) => `/follows/followers/${userId}`,
    FOLLOWING: (userId: string) => `/follows/following/${userId}`,
    STATUS: (userId: string) => `/follows/status/${userId}`,
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
export type FollowsEndpointKey = keyof typeof ENDPOINTS.FOLLOWS;
