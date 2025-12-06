import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReduxToast } from '@/hooks/useReduxToast';
import { FollowUser, FollowStatus } from '@/types/follow';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { extractServerMessage } from '@/lib/errorUtils';
import { profileKeys } from '@/hooks/useProfile';

// Query keys for follow cache
export const followKeys = {
  all: ['follows'] as const,
  followers: (userId: string) =>
    [...followKeys.all, 'followers', userId] as const,
  following: (userId: string) =>
    [...followKeys.all, 'following', userId] as const,
  status: (userId: string) => [...followKeys.all, 'status', userId] as const,
};

/**
 * Hook to follow a user
 * Sends a POST request to follow a user
 *
 * @description
 * - Calls POST /follows/follow/:userId endpoint
 * - Invalidates follow-related queries on success
 * - Shows success/error toast messages
 *
 * @param onSuccess - Optional callback function to run on successful follow
 *
 * @returns {UseMutationResult} Mutation object with follow function and loading state
 */
export function useFollowUser(onSuccess?: () => void) {
  const { showSuccess, showError } = useReduxToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.post(ENDPOINTS.FOLLOWS.FOLLOW(userId));
      return response.data;
    },
    onSuccess: (data, userId) => {
      // Invalidate follow-related queries
      queryClient.invalidateQueries({ queryKey: followKeys.all });
      // Invalidate profile queries to update follower/following counts
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      if (onSuccess) {
        onSuccess();
      }

      showSuccess('Followed', 'You are now following this user');
    },
    onError: (error: any) => {
      const message = extractServerMessage(error);
      showError('Follow Failed', message || 'Failed to follow user');
    },
  });
}

/**
 * Hook to unfollow a user
 * Sends a DELETE request to unfollow a user
 *
 * @description
 * - Calls DELETE /follows/unfollow/:userId endpoint
 * - Invalidates follow-related queries on success
 * - Shows success/error toast messages
 *
 * @param onSuccess - Optional callback function to run on successful unfollow
 *
 * @returns {UseMutationResult} Mutation object with unfollow function and loading state
 */
export function useUnfollowUser(onSuccess?: () => void) {
  const { showSuccess, showError } = useReduxToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(ENDPOINTS.FOLLOWS.UNFOLLOW(userId));
      return response.data;
    },
    onSuccess: (data, userId) => {
      // Invalidate follow-related queries
      queryClient.invalidateQueries({ queryKey: followKeys.all });
      // Invalidate profile queries to update follower/following counts
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      if (onSuccess) {
        onSuccess();
      }

      showSuccess('Unfollowed', 'You have unfollowed this user');
    },
    onError: (error: any) => {
      const message = extractServerMessage(error);
      showError('Unfollow Failed', message || 'Failed to unfollow user');
    },
  });
}

/**
 * Hook to fetch followers of a user
 * Retrieves the list of users following the specified user
 *
 * @description
 * - Fetches from GET /follows/followers/:userId endpoint
 * - Returns cached data if available
 * - Shows error toast on failure
 *
 * @param userId - UUID of the user to get followers for
 * @param enabled - Whether to enable the query (default: true)
 *
 * @returns {UseQueryResult} Query object with followers data and loading state
 */
export function useGetFollowers(userId: string, enabled = true) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: followKeys.followers(userId),
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: FollowUser[];
      }>(ENDPOINTS.FOLLOWS.FOLLOWERS(userId));
      return response.data.data;
    },
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    meta: {
      onError: (error: any) => {
        const message = extractServerMessage(error);
        showError('Error', message || 'Failed to load followers');
      },
    },
  });
}

/**
 * Hook to fetch users that a user is following
 * Retrieves the list of users that the specified user is following
 *
 * @description
 * - Fetches from GET /follows/following/:userId endpoint
 * - Returns cached data if available
 * - Shows error toast on failure
 *
 * @param userId - UUID of the user to get following for
 * @param enabled - Whether to enable the query (default: true)
 *
 * @returns {UseQueryResult} Query object with following data and loading state
 */
export function useGetFollowing(userId: string, enabled = true) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: followKeys.following(userId),
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: FollowUser[];
      }>(ENDPOINTS.FOLLOWS.FOLLOWING(userId));
      return response.data.data;
    },
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    meta: {
      onError: (error: any) => {
        const message = extractServerMessage(error);
        showError('Error', message || 'Failed to load following');
      },
    },
  });
}

/**
 * Hook to check follow status between current user and target user
 * Gets whether current user is following target user and follower/following counts
 *
 * @description
 * - Fetches from GET /follows/status/:userId endpoint (authenticated)
 * - Returns follow status and counts
 * - Shows error toast on failure
 *
 * @param targetUserId - UUID of the target user
 * @param enabled - Whether to enable the query (default: true)
 *
 * @returns {UseQueryResult} Query object with follow status data and loading state
 */
export function useFollowStatus(targetUserId: string, enabled = true) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: followKeys.status(targetUserId),
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: FollowStatus;
      }>(ENDPOINTS.FOLLOWS.STATUS(targetUserId));
      return response.data.data;
    },
    enabled: enabled && !!targetUserId,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
    meta: {
      onError: (error: any) => {
        const message = extractServerMessage(error);
        showError('Error', message || 'Failed to load follow status');
      },
    },
  });
}
