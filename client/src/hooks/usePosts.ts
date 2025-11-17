import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useReduxToast } from '@/hooks/useReduxToast';
import { CreatePostData, PostData } from '@/types/post';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { extractServerMessage } from '@/lib/errorUtils';

// Query keys for posts cache
export const postsKeys = {
  all: ['posts'] as const,
  list: () => [...postsKeys.all, 'list'] as const,
  userPosts: (userId: string) => [...postsKeys.all, 'user', userId] as const,
  detail: (id: string) => [...postsKeys.all, 'detail', id] as const,
  savedPosts: () => [...postsKeys.all, 'saved'] as const,
  likedPosts: () => [...postsKeys.all, 'liked'] as const,
};

/**
 * Hook to create a post with media files
 * Handles post creation with file uploads and form validation
 *
 * @description
 * - Creates FormData with post data and media files
 * - Makes multipart API call to create post endpoint
 * - Invalidates posts list cache on success
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - PostCreationForm component for creating new posts
 *
 * @returns {UseMutationResult} Mutation object with post creation state and methods
 */
export function useCreatePostWithMedia() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: { postData: CreatePostData; files?: File[] }) => {
      const formData = new FormData();
      formData.append('title', data.postData.title);
      if (data.postData.description)
        formData.append('description', data.postData.description);
      if (data.postData.visibility)
        formData.append('visibility', data.postData.visibility);
      if (data.postData.hashtags)
        data.postData.hashtags.forEach(h => formData.append('hashtags', h));
      formData.append(
        'allowComments',
        (data.postData.allowComments ?? true).toString()
      );
      formData.append(
        'allowLikes',
        (data.postData.allowLikes ?? true).toString()
      );
      formData.append(
        'allowShares',
        (data.postData.allowShares ?? true).toString()
      );
      formData.append(
        'allowSaves',
        (data.postData.allowSaves ?? true).toString()
      );
      if (data.postData.location) {
        formData.append('location', JSON.stringify(data.postData.location));
      }
      if (data.files) data.files.forEach(f => formData.append('files', f));

      const response = await api.post(ENDPOINTS.POSTS.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.list() });
      showSuccess('Post Created', 'The post was created successfully');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Create Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook to fetch posts list
 * Fetches paginated list of posts with optional filtering
 *
 * @description
 * - Fetches posts from API with query parameters
 * - Handles pagination and filtering
 * - Returns posts array with metadata
 * - Handles loading and error states
 *
 * @usedIn
 * - MainContent component for displaying posts feed
 * - Profile page for user posts
 *
 * @param query - Optional query parameters for filtering/pagination
 * @returns {UseQueryResult} Query object with posts list and metadata
 */
export function useGetPosts(query?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...postsKeys.list(), JSON.stringify(query || {})],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.POSTS.LIST, {
        params: query,
      });
      const data = response.data;
      if (data && data.success && data.data) {
        return {
          posts: Array.isArray(data.data) ? data.data : [],
          meta: data.meta || { page: 1, limit: 2, total: 0, totalPages: 0 },
        };
      }
      return {
        posts: [] as PostData[],
        meta: { page: 1, limit: 2, total: 0, totalPages: 0 },
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch posts by user ID (for profile pages)
 * Fetches paginated list of posts for a specific user
 *
 * @description
 * - Fetches user posts from API with query parameters
 * - Handles pagination and filtering for user content
 * - Returns posts array with metadata
 * - Handles loading and error states
 *
 * @usedIn
 * - Profile page component for displaying user posts
 * - User profile sections
 *
 * @param userId - ID of the user whose posts to fetch
 * @param query - Optional query parameters for filtering/pagination
 * @returns {UseQueryResult} Query object with user posts list and metadata
 */
export function useGetUserPosts(
  userId: string,
  query?: Record<string, unknown>
) {
  return useQuery({
    queryKey: [...postsKeys.userPosts(userId), JSON.stringify(query || {})],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.POSTS.LIST, {
        params: { ...(query || {}), userId },
      });
      if (response.data && response.data.success && response.data.data) {
        return {
          posts: Array.isArray(response.data.data) ? response.data.data : [],
          meta: response.data.meta || {
            page: 1,
            limit: 2,
            total: 0,
            totalPages: 0,
          },
        };
      }
      return {
        posts: [] as PostData[],
        meta: { page: 1, limit: 2, total: 0, totalPages: 0 },
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch authenticated user's own posts
 * Fetches posts created by the current authenticated user
 *
 * @description
 * - Requires authentication (JWT token)
 * - Fetches posts uploaded by the current user
 * - Supports pagination and filtering
 * - Returns posts list with metadata
 *
 * @param options - Optional query parameters and enabled flag
 * @returns {UseQueryResult} Query object with user's posts list and metadata
 */
export function useGetMyPosts(options?: {
  enabled?: boolean;
  query?: Record<string, unknown>;
}) {
  const { enabled = true, query = {} } = options || {};

  return useQuery({
    queryKey: [...postsKeys.list(), 'my-posts', JSON.stringify(query)],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.POSTS.MY_POSTS, {
        params: query,
      });
      if (response.data && response.data.success && response.data.data) {
        return {
          posts: Array.isArray(response.data.data) ? response.data.data : [],
          meta: response.data.meta || {
            page: 1,
            limit: 2,
            total: 0,
            totalPages: 0,
          },
        };
      }
      return {
        posts: [] as PostData[],
        meta: { page: 1, limit: 2, total: 0, totalPages: 0 },
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch user's saved posts
 * Retrieves posts that the authenticated user has saved
 *
 * @description
 * - Fetches saved posts from my-save-posts endpoint
 * - Returns posts with pagination metadata
 * - Cached for 5 minutes
 *
 * @usedIn
 * - Profile page saved posts tab
 *
 * @param options - Optional query parameters and enabled flag
 * @returns {UseQueryResult} Query object with saved posts list and metadata
 */
export function useGetMySavedPosts(options?: {
  enabled?: boolean;
  query?: Record<string, unknown>;
}) {
  const { enabled = true, query = {} } = options || {};

  return useQuery({
    queryKey: [...postsKeys.savedPosts(), JSON.stringify(query)],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.POSTS.MY_SAVE_POSTS, {
        params: query,
      });
      if (response.data && response.data.success && response.data.data) {
        return {
          posts: Array.isArray(response.data.data) ? response.data.data : [],
          meta: response.data.meta || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        };
      }
      return {
        posts: [] as PostData[],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch user's liked posts
 * Retrieves posts that the authenticated user has liked
 *
 * @description
 * - Fetches liked posts from my-like-posts endpoint
 * - Returns posts with pagination metadata
 * - Cached for 5 minutes
 *
 * @usedIn
 * - Profile page liked posts tab
 *
 * @param options - Optional query parameters and enabled flag
 * @returns {UseQueryResult} Query object with liked posts list and metadata
 */
export function useGetMyLikedPosts(options?: {
  enabled?: boolean;
  query?: Record<string, unknown>;
}) {
  const { enabled = true, query = {} } = options || {};

  return useQuery({
    queryKey: [...postsKeys.likedPosts(), JSON.stringify(query)],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.POSTS.MY_LIKE_POSTS, {
        params: query,
      });
      if (response.data && response.data.success && response.data.data) {
        return {
          posts: Array.isArray(response.data.data) ? response.data.data : [],
          meta: response.data.meta || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        };
      }
      return {
        posts: [] as PostData[],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInfinitePosts(query?: Record<string, unknown>) {
  return useInfiniteQuery({
    queryKey: [...postsKeys.list(), 'infinite', JSON.stringify(query || {})],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get(ENDPOINTS.POSTS.LIST, {
        params: { ...query, page: pageParam, limit: 2 },
      });
      const data = response.data;
      if (data && data.success && data.data) {
        return {
          posts: Array.isArray(data.data) ? data.data : [],
          meta: data.meta || { page: 1, limit: 2, total: 0, totalPages: 0 },
          nextPage:
            pageParam < (data.meta?.totalPages || 1)
              ? pageParam + 1
              : undefined,
        };
      }
      return {
        posts: [],
        meta: { page: 1, limit: 2, total: 0, totalPages: 0 },
        nextPage: undefined,
      };
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single post by ID
 * Fetches detailed post information for post detail pages
 *
 * @description
 * - Fetches single post from API by ID
 * - Returns complete post data with media and author info
 * - Handles loading and error states
 * - Automatically enabled when postId is provided
 *
 * @usedIn
 * - Post detail page component
 * - Post modal/detail views
 *
 * @param postId - ID of the post to fetch
 * @returns {UseQueryResult} Query object with post data
 */
export function useGetPostById(postId: string) {
  return useQuery({
    queryKey: postsKeys.detail(postId),
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.POSTS.DETAIL(postId));
      const data = response.data;
      if (data.success && data.data) return data.data as PostData;
      throw new Error(data.error || 'Post not found');
    },
    enabled: !!postId,
  });
}

/**
 * Hook to update a post
 * Handles post updates with validation and cache invalidation
 *
 * @description
 * - Updates post data via API call
 * - Invalidates relevant caches on success
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - Post edit forms and components
 *
 * @returns {UseMutationResult} Mutation object with post update state and methods
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async ({
      postId,
      data,
    }: {
      postId: string;
      data: Partial<CreatePostData>;
    }) => {
      const response = await api.put(ENDPOINTS.POSTS.UPDATE(postId), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.list() });
      showSuccess('Post Updated', 'The post was updated successfully');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Update Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook to delete a post
 * Handles post deletion with confirmation and cache cleanup
 *
 * @description
 * - Deletes post via API call
 * - Invalidates relevant caches on success
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - Post management components
 * - Post detail pages with delete option
 *
 * @returns {UseMutationResult} Mutation object with post deletion state and methods
 */
export function useDeletePost() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.delete(ENDPOINTS.POSTS.DELETE(postId));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.list() });
      showSuccess('Post Deleted', 'The post was deleted successfully');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Delete Failed', serverMessage || 'An error occurred');
    },
  });
}
