import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
};

/**
 * Hook to create a post with media files
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
        data.postData.hashtags.forEach(h => formData.append('hashtags[]', h));
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
      if (data.postData.location) {
        formData.append('location[name]', data.postData.location.name);
        if (data.postData.location.latitude !== undefined)
          formData.append(
            'location[latitude]',
            data.postData.location.latitude.toString()
          );
        if (data.postData.location.longitude !== undefined)
          formData.append(
            'location[longitude]',
            data.postData.location.longitude.toString()
          );
        if (data.postData.location.address)
          formData.append('location[address]', data.postData.location.address);
      }
      if (data.files) data.files.forEach(f => formData.append('files', f));

      const response = await api.post(ENDPOINTS.POSTS.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: postsKeys.list() });
      showSuccess(
        'Post Created',
        'Your post with media was created successfully'
      );
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
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
      const response = await api.get(ENDPOINTS.POSTS.LIST, {
        params: query,
      });
      const data = response.data;
      if (data && data.success && data.data) {
        return {
          posts: Array.isArray(data.data) ? data.data : [],
          meta: data.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
      }
      return {
        posts: [] as PostData[],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch posts by user ID (for profile pages)
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
    enabled: !!userId,
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
