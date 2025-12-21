import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { useReduxToast } from './useReduxToast';

export interface AdminComment {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    fullName?: string;
    avatarImage?: {
      publicUrl: string;
    };
  };
  postId: {
    _id: string;
    title: string;
    userId: {
      _id: string;
      username: string;
      avatarImage?: {
        publicUrl: string;
      };
    };
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCommentsResponse {
  comments: AdminComment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminCommentsStats {
  total: number;
}

export const useAdminGetAllComments = (
  options?: {
    page?: number;
    limit?: number;
  },
  enabled: boolean = true
) => {
  return useQuery<AdminCommentsResponse, Error>({
    queryKey: ['admin-comments', options],
    enabled,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.page) params.append('page', String(options.page));
      if (options?.limit) params.append('limit', String(options.limit));

      const url = `${ENDPOINTS.ADMIN.COMMENTS.GET_ALL}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch comments');
    },
  });
};

export const useAdminGetCommentsStats = () => {
  return useQuery<AdminCommentsStats, Error>({
    queryKey: ['admin-comments-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.COMMENTS.STATS);

      if (response.data.success) {
        return response.data.data.stats;
      }
      throw new Error(response.data.message || 'Failed to fetch statistics');
    },
  });
};

export const useAdminDeleteComment = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation<any, Error, string>({
    mutationFn: async (commentId: string) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.ADMIN.COMMENTS.DELETE(commentId)
      );

      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to delete comment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comments-stats'] });
      showSuccess('Success', 'Comment deleted successfully');
    },
    onError: (error: Error) => {
      showError('Error', error.message || 'Failed to delete comment');
    },
  });
};
