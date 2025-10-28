import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { useReduxToast } from '@/hooks/useReduxToast';
import { extractServerMessage } from '@/lib/errorUtils';
import {
  CreateLikeData,
  LikeData,
  LikeStats,
  LikesListResponseData,
  UnlikeData,
} from '@/types/like';

// Query keys for likes cache
export const likesKeys = {
  all: ['likes'] as const,
  stats: (targetType: string, targetId: string) =>
    [...likesKeys.all, 'stats', targetType, targetId] as const,
  list: (targetType: string, targetId: string) =>
    [...likesKeys.all, 'list', targetType, targetId] as const,
};

/**
 * Hook to like a post or comment
 * Handles liking content with optimistic updates and error handling
 *
 * @description
 * - Validates target type and ID
 * - Makes API call to like endpoint
 * - Invalidates relevant queries for cache consistency
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - PostActions component for like functionality
 * - Comment components for comment likes
 *
 * @returns {UseMutationResult} Mutation object with like state and methods
 */
export function useLikeTarget() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: CreateLikeData) => {
      const response = await api.post(ENDPOINTS.LIKES.LIKE, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate stats and list queries for the target
      queryClient.invalidateQueries({
        queryKey: likesKeys.stats(variables.targetType, variables.targetId),
      });
      queryClient.invalidateQueries({
        queryKey: likesKeys.list(variables.targetType, variables.targetId),
      });
      showSuccess('Liked', 'Successfully liked the content');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Like Failed', serverMessage || 'Failed to like the content');
    },
  });
}

/**
 * Hook to unlike a post or comment
 * Handles unliking content with optimistic updates and error handling
 *
 * @description
 * - Validates target type and ID
 * - Makes API call to unlike endpoint
 * - Invalidates relevant queries for cache consistency
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - PostActions component for unlike functionality
 * - Comment components for comment unlikes
 *
 * @returns {UseMutationResult} Mutation object with unlike state and methods
 */
export function useUnlikeTarget() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: UnlikeData) => {
      const response = await api.delete(
        ENDPOINTS.LIKES.UNLIKE(data.targetType, data.targetId)
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate stats and list queries for the target
      queryClient.invalidateQueries({
        queryKey: likesKeys.stats(variables.targetType, variables.targetId),
      });
      queryClient.invalidateQueries({
        queryKey: likesKeys.list(variables.targetType, variables.targetId),
      });
      showSuccess('Unliked', 'Successfully unliked the content');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError(
        'Unlike Failed',
        serverMessage || 'Failed to unlike the content'
      );
    },
  });
}

/**
 * Hook to get like statistics for a target
 * Fetches like count and user's like status for posts/comments
 *
 * @description
 * - Fetches like statistics from API
 * - Returns total likes count and user's like status
 * - Handles loading and error states
 * - Automatically enabled when targetType and targetId are provided
 *
 * @usedIn
 * - PostActions component to display like count and status
 * - PostCard component for like statistics
 *
 * @param targetType - Type of target ('post' or 'comment')
 * @param targetId - ID of the target
 * @returns {UseQueryResult} Query object with like statistics
 */
export function useLikeStats(targetType: 'post' | 'comment', targetId: string) {
  return useQuery({
    queryKey: likesKeys.stats(targetType, targetId),
    queryFn: async () => {
      const response = await api.get(
        ENDPOINTS.LIKES.STATS(targetType, targetId)
      );
      const data = response.data;
      if (data && data.success && data.data) {
        return data.data.stats;
      }
      return { totalLikes: 0, isLikedByUser: false };
    },
    enabled: !!targetType && !!targetId,
  });
}

/**
 * Hook to get likes for a target
 * Fetches paginated list of users who liked a post/comment
 *
 * @description
 * - Fetches paginated list of likes from API
 * - Returns likes with user information and pagination metadata
 * - Handles loading and error states
 * - Automatically enabled when targetType and targetId are provided
 *
 * @usedIn
 * - Like list modal/component to show who liked content
 *
 * @param targetType - Type of target ('post' or 'comment')
 * @param targetId - ID of the target
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of likes per page (default: 20)
 * @returns {UseQueryResult} Query object with likes list and pagination
 */
export function useGetLikes(
  targetType: 'post' | 'comment',
  targetId: string,
  page = 1,
  limit = 20
) {
  return useQuery({
    queryKey: [...likesKeys.list(targetType, targetId), page, limit],
    queryFn: async () => {
      const response = await api.get(
        ENDPOINTS.LIKES.GET_LIKES(targetType, targetId),
        {
          params: { page, limit },
        }
      );
      const data = response.data;
      if (data && data.success && data.data) {
        return {
          likes: data.data.likes || [],
          meta: data.data.meta || {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        };
      }
      return {
        likes: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    },
    enabled: !!targetType && !!targetId,
  });
}
