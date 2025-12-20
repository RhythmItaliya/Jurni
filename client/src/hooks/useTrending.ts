import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useReduxToast } from '@/hooks/useReduxToast';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { extractServerMessage } from '@/lib/errorUtils';
import { PostData } from '@/types/post';

// Query keys for trending cache
export const trendingKeys = {
  all: ['trending'] as const,
  postsInfinite: (limit: number) =>
    [...trendingKeys.all, 'posts', 'infinite', limit] as const,
  hashtags: (limit: number) =>
    [...trendingKeys.all, 'hashtags', limit] as const,
};

/**
 * Hook to get trending posts with infinite scroll
 * Fetches posts sorted by popularity/trending algorithm
 *
 * @description
 * - Fetches from GET /posts/list?sortBy=trending endpoint
 * - Returns paginated trending posts with infinite loading
 * - Cached for 5 minutes
 *
 * @param limit - Number of posts per page (default: 8)
 * @param enabled - Whether to enable the query (default: true)
 *
 * @returns {UseInfiniteQueryResult} Query object with trending posts data
 */
export function useGetTrendingPosts(
  limit: number = 8,
  enabled: boolean = true
) {
  const { showError } = useReduxToast();

  return useInfiniteQuery({
    queryKey: trendingKeys.postsInfinite(limit),
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await api.get(ENDPOINTS.POSTS.LIST, {
          params: {
            sortBy: 'trending',
            page: pageParam,
            limit,
          },
        });
        return {
          posts: response.data.data as PostData[],
          meta: response.data.meta,
          nextPage: pageParam + 1,
        };
      } catch (error) {
        const message = extractServerMessage(error);
        showError(
          'Failed to load trending posts',
          message || 'Try again later'
        );
        throw error;
      }
    },
    getNextPageParam: lastPage => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.nextPage;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled,
  });
}

/**
 * Hook to get trending hashtags
 * Fetches trending hashtags based on post count
 *
 * @description
 * - Fetches from GET /suggestions/hashtags endpoint
 * - Returns hashtags with post counts
 * - Cached for 10 minutes
 *
 * @param limit - Number of hashtags to return (default: 10)
 * @param enabled - Whether to enable the query (default: true)
 *
 * @returns {UseQueryResult} Query object with trending hashtags
 */
export function useGetTrendingHashtags(
  limit: number = 10,
  enabled: boolean = true
) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: trendingKeys.hashtags(limit),
    queryFn: async () => {
      try {
        const response = await api.get(ENDPOINTS.SUGGESTIONS.HASHTAGS, {
          params: { limit },
        });
        return response.data.data as Array<{
          hashtag: string;
          count: number;
        }>;
      } catch (error) {
        const message = extractServerMessage(error);
        showError(
          'Failed to load trending hashtags',
          message || 'Try again later'
        );
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled,
  });
}
