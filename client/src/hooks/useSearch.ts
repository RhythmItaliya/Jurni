import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { extractServerMessage } from '@/lib/errorUtils';
import { useReduxToast } from './useReduxToast';

// Query keys for search cache
export const searchKeys = {
  all: ['search'] as const,
  users: (query: string, page: number = 1, limit: number = 20) =>
    [...searchKeys.all, 'users', query, page, limit] as const,
  posts: (query: string, page: number = 1, limit: number = 20) =>
    [...searchKeys.all, 'posts', query, page, limit] as const,
  hashtags: (query: string, limit: number = 20) =>
    [...searchKeys.all, 'hashtags', query, limit] as const,
  locations: (query: string, page: number = 1, limit: number = 20) =>
    [...searchKeys.all, 'locations', query, page, limit] as const,
  all_search: (
    query: string,
    type: 'all' | 'users' | 'posts' | 'hashtags' | 'locations' = 'all',
    page: number = 1,
    limit: number = 20
  ) => [...searchKeys.all, 'all', query, type, page, limit] as const,
  locations_search: (query: string, page: number = 1, limit: number = 20) =>
    [...searchKeys.all, 'locations_search', query, page, limit] as const,
};

/**
 * Hook to search for users by username or name
 * @param query - Search query string
 * @param page - Page number for pagination
 * @param limit - Results per page
 * @param enabled - Whether to enable the query
 * @returns Query result with users data
 */
export function useSearchUsers(
  query: string,
  page: number = 1,
  limit: number = 20,
  enabled: boolean = true
) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: searchKeys.users(query, page, limit),
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.SEARCH.USERS, {
        params: { query, page, limit },
      });
      return response.data.data;
    },
    enabled: enabled && !!query && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    meta: {
      onError: (error: unknown) => {
        const message = extractServerMessage(error);
        showError('Search Error', message || 'Failed to search users');
      },
    },
  });
}

/**
 * Hook to search for posts by title, description, or hashtags
 * @param query - Search query string
 * @param page - Page number for pagination
 * @param limit - Results per page
 * @param enabled - Whether to enable the query
 * @returns Query result with posts data
 */
export function useSearchPosts(
  query: string,
  page: number = 1,
  limit: number = 20,
  enabled: boolean = true
) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: searchKeys.posts(query, page, limit),
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.SEARCH.POSTS, {
        params: { query, page, limit },
      });
      return response.data.data;
    },
    enabled: enabled && !!query && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    meta: {
      onError: (error: unknown) => {
        const message = extractServerMessage(error);
        showError('Search Error', message || 'Failed to search posts');
      },
    },
  });
}

/**
 * Hook to search for hashtags
 * @param query - Search query string
 * @param limit - Results limit
 * @param enabled - Whether to enable the query
 * @returns Query result with hashtags data
 */
export function useSearchHashtags(
  query: string,
  limit: number = 20,
  enabled: boolean = true
) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: searchKeys.hashtags(query, limit),
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.SEARCH.HASHTAGS, {
        params: { query, limit },
      });
      return response.data.data;
    },
    enabled: enabled && !!query && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    meta: {
      onError: (error: unknown) => {
        const message = extractServerMessage(error);
        showError('Search Error', message || 'Failed to search hashtags');
      },
    },
  });
}

/**
 * Hook for universal search across all types
 * @param query - Search query string
 * @param type - Search type (all, users, posts, hashtags)
 * @param page - Page number for pagination
 * @param limit - Results per page
 * @param enabled - Whether to enable the query
 * @returns Query result with combined search data
 */
export function useSearch(
  query: string,
  type: 'all' | 'users' | 'posts' | 'hashtags' | 'locations' = 'all',
  page: number = 1,
  limit: number = 20,
  enabled: boolean = true
) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: searchKeys.all_search(query, type, page, limit),
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.SEARCH.ALL, {
        params: { query, type, page, limit },
      });
      return response.data.data;
    },
    enabled: enabled && !!query && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    meta: {
      onError: (error: unknown) => {
        const message = extractServerMessage(error);
        showError('Search Error', message || 'Failed to perform search');
      },
    },
  });
}

/**
 * Hook to search locations
 * Searches for locations by city, state, county, etc.
 * @param query - Search query string
 * @param page - Page number (default 1)
 * @param limit - Results per page (default 20)
 * @param enabled - Whether to enable the query
 * @returns Query result with locations array
 */
export function useSearchLocations(
  query: string,
  page: number = 1,
  limit: number = 20,
  enabled: boolean = true
) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: searchKeys.locations_search(query, page, limit),
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.SEARCH.LOCATIONS, {
        params: { query, page, limit },
      });
      return response.data.data || [];
    },
    enabled: enabled && !!query && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    meta: {
      onError: (error: unknown) => {
        const message = extractServerMessage(error);
        showError(
          'Location Search Error',
          message || 'Failed to search locations'
        );
      },
    },
  });
}
