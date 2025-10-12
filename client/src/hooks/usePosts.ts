import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReduxToast } from '@/hooks/useReduxToast';
import { CreatePostData, PostData } from '@/types/post';
import {
  createPost,
  createPostWithMedia,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '@/lib/postsApi';

// Query keys for posts cache
export const postsKeys = {
  all: ['posts'] as const,
  list: () => [...postsKeys.all, 'list'] as const,
  detail: (id: string) => [...postsKeys.all, 'detail', id] as const,
};

/**
 * Hook to create a post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await createPost(data);
      return response;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: postsKeys.list() });
      showSuccess('Post Created', 'Your post was created successfully');
    },
    onError: error => {
      const serverMessage =
        error && typeof error === 'object' && 'response' in error
          ? (
              error as {
                response: { data?: { message?: string; error?: string } };
              }
            ).response.data?.message ||
            (
              error as {
                response: { data?: { message?: string; error?: string } };
              }
            ).response.data?.error ||
            String((error as { response: { data?: unknown } }).response.data)
          : (error as { message?: string })?.message;
      showError('Create Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook to create a post with media files
 */
export function useCreatePostWithMedia() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: { postData: CreatePostData; files?: File[] }) => {
      const response = await createPostWithMedia(data.postData, data.files);
      return response;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: postsKeys.list() });
      showSuccess(
        'Post Created',
        'Your post with media was created successfully'
      );
    },
    onError: error => {
      const serverMessage =
        error && typeof error === 'object' && 'response' in error
          ? (
              error as {
                response: { data?: { message?: string; error?: string } };
              }
            ).response.data?.message ||
            (
              error as {
                response: { data?: { message?: string; error?: string } };
              }
            ).response.data?.error ||
            String((error as { response: { data?: unknown } }).response.data)
          : (error as { message?: string })?.message;
      showError('Create Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook to fetch posts list
 */
export function useGetPosts(query?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...postsKeys.list(), JSON.stringify(query || {})],
    queryFn: async () => {
      const response = await getPosts(query);
      if (response.success && response.data) {
        if (Array.isArray(response.data)) return response.data as PostData[];
        if ('posts' in response.data) return response.data.posts as PostData[];
      }
      return [] as PostData[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single post by ID
 */
export function useGetPostById(postId: string) {
  return useQuery({
    queryKey: postsKeys.detail(postId),
    queryFn: async () => {
      const response = await getPostById(postId);
      if (response.success && response.data) return response.data as PostData;
      throw new Error(response.error || 'Post not found');
    },
    enabled: !!postId,
  });
}

/**
 * Hook to update a post
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
      const response = await updatePost(postId, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.list() });
      showSuccess('Post Updated', 'The post was updated successfully');
    },
    onError: error => {
      const serverMessage =
        error && typeof error === 'object' && 'response' in error
          ? (
              error as {
                response: { data?: { message?: string; error?: string } };
              }
            ).response.data?.message ||
            (
              error as {
                response: { data?: { message?: string; error?: string } };
              }
            ).response.data?.error ||
            String((error as { response: { data?: unknown } }).response.data)
          : (error as { message?: string })?.message;
      showError('Update Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook to delete a post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await deletePost(postId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.list() });
      showSuccess('Post Deleted', 'The post was deleted successfully');
    },
    onError: error => {
      const serverMessage =
        error && typeof error === 'object' && 'response' in error
          ? (
              error as {
                response: { data?: { message?: string; error?: string } };
              }
            ).response.data?.message ||
            (
              error as {
                response: { data?: { message?: string; error?: string } };
              }
            ).response.data?.error ||
            String((error as { response: { data?: unknown } }).response.data)
          : (error as { message?: string })?.message;
      showError('Delete Failed', serverMessage || 'An error occurred');
    },
  });
}
