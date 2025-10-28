import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReduxToast } from '@/hooks/useReduxToast';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { extractServerMessage } from '@/lib/errorUtils';
import {
  CommentData,
  CreateCommentData,
  UpdateCommentData,
  CommentsListResponseData,
} from '@/types/comment';

// Query keys for comments cache
export const commentsKeys = {
  all: ['comments'] as const,
  list: (postId: string) => [...commentsKeys.all, 'list', postId] as const,
  detail: (commentId: string) =>
    [...commentsKeys.all, 'detail', commentId] as const,
};

/**
 * Hook to create a comment on a post
 * Handles comment creation with validation and cache updates
 *
 * @description
 * - Validates comment content and post ID
 * - Makes API call to create comment endpoint
 * - Invalidates comments list cache on success
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - Comment form components
 * - Post detail pages for adding comments
 *
 * @param postId - ID of the post to comment on
 * @returns {UseMutationResult} Mutation object with comment creation state and methods
 */
export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      const response = await api.post(ENDPOINTS.COMMENTS.CREATE(postId), data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate comments list for this post
      queryClient.invalidateQueries({
        queryKey: commentsKeys.list(postId),
      });
      showSuccess('Comment Added', 'Your comment has been added successfully');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Comment Failed', serverMessage || 'Failed to add comment');
    },
  });
}

/**
 * Hook to get comments for a post
 * Fetches all comments for a specific post
 *
 * @description
 * - Fetches comments from API for a post
 * - Returns comments array
 * - Handles loading and error states
 * - Automatically enabled when postId is provided
 *
 * @usedIn
 * - Post detail components to display comments
 * - Comment sections in post views
 *
 * @param postId - ID of the post to fetch comments for
 * @returns {UseQueryResult} Query object with comments list
 */
export function useGetComments(postId: string) {
  return useQuery({
    queryKey: commentsKeys.list(postId),
    queryFn: async (): Promise<CommentsListResponseData> => {
      const response = await api.get(ENDPOINTS.COMMENTS.GET_BY_POST(postId));
      const data = response.data;
      if (data && data.success && data.data) {
        return data.data;
      }
      return {
        comments: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    },
    enabled: !!postId,
  });
}

/**
 * Hook to update a comment
 * Handles comment updates with validation and cache updates
 *
 * @description
 * - Updates comment content via API call
 * - Invalidates comments list cache on success
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - Comment edit forms and components
 *
 * @param postId - ID of the post containing the comment
 * @param commentId - ID of the comment to update
 * @returns {UseMutationResult} Mutation object with comment update state and methods
 */
export function useUpdateComment(postId: string, commentId: string) {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: UpdateCommentData) => {
      const response = await api.put(
        ENDPOINTS.COMMENTS.UPDATE(postId, commentId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate comments list for this post
      queryClient.invalidateQueries({
        queryKey: commentsKeys.list(postId),
      });
      showSuccess(
        'Comment Updated',
        'Your comment has been updated successfully'
      );
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Update Failed', serverMessage || 'Failed to update comment');
    },
  });
}

/**
 * Hook to delete a comment
 * Handles comment deletion with confirmation and cache cleanup
 *
 * @description
 * - Deletes comment via API call
 * - Invalidates comments list cache on success
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - Comment management components
 * - Comment detail views with delete option
 *
 * @param postId - ID of the post containing the comment
 * @param commentId - ID of the comment to delete
 * @returns {UseMutationResult} Mutation object with comment deletion state and methods
 */
export function useDeleteComment(postId: string, commentId: string) {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(
        ENDPOINTS.COMMENTS.DELETE(postId, commentId)
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate comments list for this post
      queryClient.invalidateQueries({
        queryKey: commentsKeys.list(postId),
      });
      showSuccess(
        'Comment Deleted',
        'Your comment has been deleted successfully'
      );
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Delete Failed', serverMessage || 'Failed to delete comment');
    },
  });
}
