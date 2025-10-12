import api from './axios';
import { ENDPOINTS } from './endpoints';
import { CreatePostData, PostApiResponse } from '@/types/post';

/**
 * Posts API service functions - Only Ready Server APIs
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
export const createPost = async (
  postData: CreatePostData
): Promise<PostApiResponse> => {
  const response = await api.post(ENDPOINTS.POSTS.CREATE, postData);
  return response.data;
};

/**
 * Get posts with filtering and pagination
 */
export const getPosts = async (
  query?: PostsQuery
): Promise<PostApiResponse> => {
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
 * Create post with media files
 */
export const createPostWithMedia = async (
  postData: CreatePostData,
  files?: File[]
): Promise<PostApiResponse> => {
  const formData = new FormData();

  // Add post data
  formData.append('title', postData.title);
  if (postData.description) {
    formData.append('description', postData.description);
  }
  if (postData.visibility) {
    formData.append('visibility', postData.visibility);
  }
  if (postData.hashtags && postData.hashtags.length > 0) {
    postData.hashtags.forEach(tag => {
      formData.append('hashtags[]', tag);
    });
  }
  // Always send boolean values with defaults
  formData.append('allowComments', (postData.allowComments ?? true).toString());
  formData.append('allowLikes', (postData.allowLikes ?? true).toString());
  formData.append('allowShares', (postData.allowShares ?? true).toString());

  // Add files
  if (files && files.length > 0) {
    files.forEach(file => {
      formData.append('files', file);
    });
  }

  const response = await api.post(ENDPOINTS.POSTS.CREATE_WITH_MEDIA, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
