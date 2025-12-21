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
    LOCATION_POSTS: (location: string) => `/posts/location/${location}`,
    MY_POSTS: '/posts/my-posts',
    MY_SAVE_POSTS: '/posts/my-save-posts',
    MY_LIKE_POSTS: '/posts/my-like-posts',
    USER_SAVE_POSTS: (userId: string) => `/posts/user-save-posts/${userId}`,
    USER_LIKE_POSTS: (userId: string) => `/posts/user-like-posts/${userId}`,
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
  ADMIN: {
    AUTH: {
      LOGIN: '/admin/auth/login',
      REGISTER: '/admin/auth/register',
    },
    USERS: {
      GET_ALL: '/admin/users/list',
      GET_BY_UUID: (uuid: string) => `/admin/users/${uuid}`,
      UPDATE: (uuid: string) => `/admin/users/${uuid}`,
      DELETE: (uuid: string) => `/admin/users/${uuid}`,
    },
    POSTS: {
      GET_ALL: '/admin/posts',
      GET_BY_ID: (id: string) => `/admin/posts/${id}`,
      UPDATE_STATUS: (id: string) => `/admin/posts/${id}/status`,
      DELETE: (id: string) => `/admin/posts/${id}`,
      STATS: '/admin/posts/stats',
    },
    COMMENTS: {
      GET_ALL: '/admin/comments',
      DELETE: (id: string) => `/admin/comments/${id}`,
      STATS: '/admin/comments/stats',
    },
    ADMINS: {
      GET_ALL: '/admin',
      GET_BY_UUID: (uuid: string) => `/admin/${uuid}`,
      UPDATE: (uuid: string) => `/admin/${uuid}`,
      DELETE: (uuid: string) => `/admin/${uuid}`,
      CHANGE_PASSWORD: (uuid: string) => `/admin/${uuid}/password`,
    },
    REPORTS: {
      GET_ALL: '/admin/reports',
      GET_BY_UUID: (uuid: string) => `/admin/reports/${uuid}`,
      UPDATE_STATUS: (uuid: string) => `/admin/reports/${uuid}/status`,
      DELETE: (uuid: string) => `/admin/reports/${uuid}`,
      STATS: '/admin/reports/stats',
    },
    ACTIVITY: '/admin/activity',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_UUID: (uuid: string) => `/users/${uuid}`,
    UPDATE: (uuid: string) => `/users/${uuid}`,
    DELETE: (uuid: string) => `/users/${uuid}`,
    SUSPEND: (uuid: string) => `/users/${uuid}/suspend`,
    UNSUSPEND: (uuid: string) => `/users/${uuid}/unsuspend`,
  },
  REPORTS: {
    CREATE: '/reports',
    GET_ALL: '/reports',
    GET_BY_TYPE: (type: 'post' | 'user') => `/reports/type/${type}`,
    GET_BY_STATUS: (status: string) => `/reports/status/${status}`,
    GET_BY_ID: (id: string) => `/reports/${id}`,
    UPDATE: (id: string) => `/reports/${id}`,
    DELETE: (id: string) => `/reports/${id}`,
  },
  SEARCH: {
    ALL: '/search',
    USERS: '/search/users',
    POSTS: '/search/posts',
    HASHTAGS: '/search/hashtags',
    LOCATIONS: '/search/locations',
  },
  SUGGESTIONS: {
    USERS: '/suggestions/users',
    HASHTAGS: '/suggestions/hashtags',
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
export type AdminEndpointKey = keyof typeof ENDPOINTS.ADMIN;
export type AdminAuthEndpointKey = keyof typeof ENDPOINTS.ADMIN.AUTH;
export type ReportsEndpointKey = keyof typeof ENDPOINTS.REPORTS;
export type SearchEndpointKey = keyof typeof ENDPOINTS.SEARCH;
export type SuggestionsEndpointKey = keyof typeof ENDPOINTS.SUGGESTIONS;
