import { useQuery } from '@tanstack/react-query';
import { useReduxToast } from '@/hooks/useReduxToast';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { extractServerMessage } from '@/lib/errorUtils';

// Query keys for suggestions cache
export const suggestionsKeys = {
  all: ['suggestions'] as const,
  users: ['suggestions', 'users'] as const,
  hashtags: ['suggestions', 'hashtags'] as const,
};

/**
 * Suggested user type
 */
export interface SuggestedUser {
  _id: string;
  uuid: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarImage?: {
    publicUrl?: string;
    url?: string;
  };
  bio: string;
  location?: Record<string, unknown>;
  followersCount: number;
  followingCount: number;
  isFollower: boolean; // If they follow the current user
}

/**
 * Trending hashtag type
 */
export interface TrendingHashtag {
  hashtag: string;
  count: number;
}

/**
 * Hook to get user suggestions
 * Fetches suggested users that the current user is not following
 * Randomizes order on each fetch and refetches every 2 minutes
 *
 * @param limit - Number of suggestions to return (default: 10)
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query result with suggestions data
 */
export function useSuggestions(limit: number = 10, enabled: boolean = true) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: [...suggestionsKeys.users, limit],
    queryFn: async () => {
      try {
        const response = await api.get(ENDPOINTS.SUGGESTIONS.USERS, {
          params: { limit: limit * 2 }, // Fetch more to randomize
        });
        const users = response.data.data as SuggestedUser[];

        // Shuffle the results and return only the requested limit
        const shuffled = users.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, limit);
      } catch (error) {
        const message = extractServerMessage(error);
        showError('Failed to load suggestions', message || 'Try again later');
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced from 5)
    gcTime: 10 * 60 * 1000, // 10 minutes (reduced from 30)
    refetchOnMount: 'always', // Always refetch on mount to get new random order
    enabled,
  });
}

/**
 * Hook to get trending hashtags
 * Fetches trending hashtags based on recent posts (last 30 days)
 * Refetches every 10 minutes
 *
 * @param limit - Number of hashtags to return (default: 10)
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query result with trending hashtags
 */
export function useTrendingHashtags(
  limit: number = 10,
  enabled: boolean = true
) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: suggestionsKeys.hashtags,
    queryFn: async () => {
      try {
        const response = await api.get(ENDPOINTS.SUGGESTIONS.HASHTAGS, {
          params: { limit },
        });
        return response.data.data as TrendingHashtag[];
      } catch (error) {
        const message = extractServerMessage(error);
        showError(
          'Failed to load trending hashtags',
          message || 'Try again later'
        );
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (cache time)
    enabled,
  });
}
