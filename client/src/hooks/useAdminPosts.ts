import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { useReduxToast } from './useReduxToast';

export interface AdminPost {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    fullName?: string;
    avatarImage?: {
      publicUrl: string;
    };
  };
  title: string;
  description?: string;
  hashtags: string[];
  location?: any;
  status: 'active' | 'deleted' | 'archived' | 'draft';
  visibility: 'public' | 'private' | 'friends' | 'followers';
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPostsResponse {
  posts: AdminPost[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminPostsStats {
  total: number;
  active: number;
  deleted: number;
  archived: number;
  draft: number;
  reported: number;
}

/**
 * Hook to get all posts with filtering
 */
export const useAdminGetAllPosts = (
  options?: {
    status?: 'active' | 'deleted' | 'archived' | 'draft';
    page?: number;
    limit?: number;
  },
  enabled: boolean = true
) => {
  return useQuery<AdminPostsResponse, Error>({
    queryKey: ['admin-posts', options],
    enabled,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.status) params.append('status', options.status);
      if (options?.page) params.append('page', String(options.page));
      if (options?.limit) params.append('limit', String(options.limit));

      const url = `${ENDPOINTS.ADMIN.POSTS.GET_ALL}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch posts');
    },
  });
};

/**
 * Hook to get posts statistics
 */
export const useAdminGetPostsStats = () => {
  return useQuery<AdminPostsStats, Error>({
    queryKey: ['admin-posts-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.POSTS.STATS);

      if (response.data.success) {
        return response.data.data.stats;
      }
      throw new Error(response.data.message || 'Failed to fetch statistics');
    },
  });
};

/**
 * Hook to get post by ID
 */
export const useAdminGetPostById = (postId: string) => {
  return useQuery<AdminPost, Error>({
    queryKey: ['admin-post', postId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        ENDPOINTS.ADMIN.POSTS.GET_BY_ID(postId)
      );

      if (response.data.success) {
        return response.data.data.post;
      }
      throw new Error(response.data.message || 'Failed to fetch post');
    },
    enabled: !!postId,
  });
};

/**
 * Hook to update post status
 */
export const useAdminUpdatePostStatus = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async ({
      postId,
      status,
    }: {
      postId: string;
      status: 'active' | 'deleted' | 'archived' | 'draft';
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.ADMIN.POSTS.UPDATE_STATUS(postId),
        { status }
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update post status');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-posts-stats'] });
      showSuccess('Success', 'Post status updated successfully');
    },
    onError: (error: Error) => {
      showError('Error', error.message || 'Failed to update post status');
    },
  });
};

/**
 * Hook to delete post permanently
 */
export const useAdminDeletePost = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.ADMIN.POSTS.DELETE(postId)
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to delete post');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-posts-stats'] });
      showSuccess('Success', 'Post deleted successfully');
    },
    onError: (error: Error) => {
      showError('Error', error.message || 'Failed to delete post');
    },
  });
};
