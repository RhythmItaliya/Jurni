import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { useReduxToast } from '@/hooks/useReduxToast';
import { extractServerMessage } from '@/lib/errorUtils';
import { CreateSavePostData, UnsavePostData } from '@/types/savepost';

// Query keys for saveposts cache
export const savePostsKeys = {
  all: ['saveposts'] as const,
  stats: (postId: string) => [...savePostsKeys.all, 'stats', postId] as const,
  list: () => [...savePostsKeys.all, 'list'] as const,
};

/**
 * Hook to save a post
 * Handles saving posts with optimistic updates and error handling
 *
 * @description
 * - Validates post ID
 * - Makes API call to save endpoint
 * - Invalidates relevant queries for cache consistency
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - PostActions component for save functionality
 *
 * @returns {UseMutationResult} Mutation object with save state and methods
 */
export function useSavePost() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: CreateSavePostData) => {
      const response = await api.post(ENDPOINTS.SAVEPOSTS.SAVE, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate stats query for the post
      queryClient.invalidateQueries({
        queryKey: savePostsKeys.stats(variables.postId),
      });
      // Invalidate user's saved posts list
      queryClient.invalidateQueries({
        queryKey: savePostsKeys.list(),
      });
      showSuccess('Saved', 'Post saved successfully');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Save Failed', serverMessage || 'Failed to save the post');
    },
  });
}

/**
 * Hook to unsave a post
 * Handles unsaving posts with optimistic updates and error handling
 *
 * @description
 * - Validates post ID
 * - Makes API call to unsave endpoint
 * - Invalidates relevant queries for cache consistency
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - PostActions component for unsave functionality
 *
 * @returns {UseMutationResult} Mutation object with unsave state and methods
 */
export function useUnsavePost() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: UnsavePostData) => {
      const response = await api.delete(
        ENDPOINTS.SAVEPOSTS.UNSAVE(data.postId)
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate stats query for the post
      queryClient.invalidateQueries({
        queryKey: savePostsKeys.stats(variables.postId),
      });
      // Invalidate user's saved posts list
      queryClient.invalidateQueries({
        queryKey: savePostsKeys.list(),
      });
      showSuccess('Unsaved', 'Post removed from saved posts');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Unsave Failed', serverMessage || 'Failed to unsave the post');
    },
  });
}

/**
 * Hook to get save statistics for a post
 * Fetches save count and user's save status for posts
 *
 * @description
 * - Fetches save statistics from API
 * - Returns total saves count and user's save status
 * - Handles loading and error states
 * - Automatically enabled when postId is provided
 *
 * @usedIn
 * - PostActions component to display save count and status
 * - PostCard component for save statistics
 *
 * @param postId - ID of the post
 * @returns {UseQueryResult} Query object with save statistics
 */
export function useSavePostStats(postId: string) {
  return useQuery({
    queryKey: savePostsKeys.stats(postId),
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.SAVEPOSTS.STATS(postId));
      const data = response.data;
      if (data && data.success && data.data) {
        return data.data.stats;
      }
      return { totalSaves: 0, isSavedByUser: false };
    },
    enabled: !!postId,
  });
}

/**
 * Hook to get user's saved posts
 * Fetches paginated list of user's saved posts
 *
 * @description
 * - Fetches paginated list of saved posts from API
 * - Returns saved posts with post information and pagination metadata
 * - Handles loading and error states
 *
 * @usedIn
 * - Saved posts page/component to show user's saved content
 *
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of posts per page (default: 20)
 * @returns {UseQueryResult} Query object with saved posts list and pagination
 */
export function useGetSavedPosts(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...savePostsKeys.list(), page, limit],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.SAVEPOSTS.LIST, {
        params: { page, limit },
      });
      const data = response.data;
      if (data && data.success && data.data) {
        return {
          saves: data.data.saves || [],
          meta: data.data.meta || {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        };
      }
      return {
        saves: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    },
  });
}
