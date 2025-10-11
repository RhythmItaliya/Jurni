import api from './axios';
import { ENDPOINTS } from './endpoints';
import { CreatePostData, PostData, PostApiResponse } from '@/types/post';

/**
 * Posts API service functions
 */

export interface PostsQuery {
  userId?: string;
  visibility?: 'public' | 'friends' | 'followers' | 'private';
  hashtag?: string;
  location?: string;
  search?: string;
  sortBy?: 'recent' | 'popular' | 'trending' | 'oldest';
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Create a new post
 */
export const createPost = async (postData: CreatePostData): Promise<PostApiResponse> => {
  const response = await api.post(ENDPOINTS.POSTS.CREATE, postData);
  return response.data;
};

/**
 * Get posts with filtering and pagination
 */
export const getPosts = async (query?: PostsQuery): Promise<PostApiResponse> => {
  const response = await api.get(ENDPOINTS.POSTS.GET_ALL, { params: query });
  return response.data;
};

/**
 * Get a single post by ID
 */
export const getPostById = async (postId: string): Promise<PostApiResponse> => {
  const response = await api.get(ENDPOINTS.POSTS.GET_BY_ID(postId));
  return response.data;
};

/**
 * Update a post
 */
export const updatePost = async (
  postId: string, 
  updateData: Partial<CreatePostData>
): Promise<PostApiResponse> => {
  const response = await api.put(ENDPOINTS.POSTS.UPDATE(postId), updateData);
  return response.data;
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string): Promise<PostApiResponse> => {
  const response = await api.delete(ENDPOINTS.POSTS.DELETE(postId));
  return response.data;
};

/**
 * Like/Unlike a post
 */
export const toggleLikePost = async (postId: string): Promise<{
  success: boolean;
  data: { liked: boolean; likesCount: number };
}> => {
  const response = await api.post(ENDPOINTS.POSTS.LIKE(postId));
  return response.data;
};

/**
 * Save/Unsave a post
 */
export const toggleSavePost = async (postId: string): Promise<{
  success: boolean;
  data: { saved: boolean; savesCount: number };
}> => {
  const response = await api.post(ENDPOINTS.POSTS.SAVE(postId));
  return response.data;
};

/**
 * Share a post
 */
export const sharePost = async (
  postId: string,
  shareData?: CreatePostData
): Promise<PostApiResponse> => {
  const response = await api.post(ENDPOINTS.POSTS.SHARE(postId), shareData);
  return response.data;
};

/**
 * Get trending hashtags
 */
export const getTrendingHashtags = async (limit?: number): Promise<{
  success: boolean;
  data: Array<{ hashtag: string; count: number }>;
}> => {
  const response = await api.get(ENDPOINTS.POSTS.TRENDING_HASHTAGS, {
    params: { limit }
  });
  return response.data;
};

/**
 * Get saved posts
 */
export const getSavedPosts = async (page?: number, limit?: number): Promise<PostApiResponse> => {
  const response = await api.get(ENDPOINTS.POSTS.SAVED, {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Get user posts
 */
export const getUserPosts = async (
  userId: string,
  query?: PostsQuery
): Promise<PostApiResponse> => {
  const response = await api.get(ENDPOINTS.POSTS.USER_POSTS(userId), {
    params: query
  });
  return response.data;
};

/**
 * Comments API functions
 */

export interface CreateCommentData {
  content: string;
  parentCommentId?: string;
}

/**
 * Create a comment
 */
export const createComment = async (
  postId: string,
  commentData: CreateCommentData
): Promise<any> => {
  const response = await api.post(ENDPOINTS.COMMENTS.CREATE(postId), commentData);
  return response.data;
};

/**
 * Get comments for a post
 */
export const getComments = async (
  postId: string,
  page?: number,
  limit?: number
): Promise<any> => {
  const response = await api.get(ENDPOINTS.COMMENTS.GET_ALL(postId), {
    params: { page, limit }
  });
  return response.data;
};

/**
 * Update a comment
 */
export const updateComment = async (
  postId: string,
  commentId: string,
  content: string
): Promise<any> => {
  const response = await api.put(ENDPOINTS.COMMENTS.UPDATE(postId, commentId), { content });
  return response.data;
};

/**
 * Delete a comment
 */
export const deleteComment = async (postId: string, commentId: string): Promise<any> => {
  const response = await api.delete(ENDPOINTS.COMMENTS.DELETE(postId, commentId));
  return response.data;
};

/**
 * Like/Unlike a comment
 */
export const toggleLikeComment = async (
  postId: string,
  commentId: string
): Promise<any> => {
  const response = await api.post(ENDPOINTS.COMMENTS.LIKE(postId, commentId));
  return response.data;
};

/**
 * Reply to a comment
 */
export const replyToComment = async (
  postId: string,
  commentId: string,
  content: string
): Promise<any> => {
  const response = await api.post(ENDPOINTS.COMMENTS.REPLY(postId, commentId), { content });
  return response.data;
};