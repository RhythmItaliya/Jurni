import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { useReduxToast } from './useReduxToast';

export interface Report {
  _id: string;
  uuid: string;
  reportType: 'post' | 'user';
  reportedId: string;
  reporterId: {
    _id: string;
    username: string;
    email: string;
    avatarImage?: {
      key: string;
      url: string;
      publicUrl: string;
      bucket: string;
      size: number;
      contentType: string;
      mediaId: string;
    };
  };
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  reviewedBy?: {
    _id: string;
    username: string;
    email: string;
  };
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  reportedUser?: {
    _id: string;
    uuid: string;
    username: string;
    email: string;
    avatarImage?: {
      key: string;
      url: string;
      publicUrl: string;
      bucket: string;
      size: number;
      contentType: string;
      mediaId: string;
    };
    isActive: boolean;
    isSuspended: boolean;
  };
  reportedPost?: {
    _id: string;
    uuid: string;
    caption?: string;
    mediaUrl?: string[];
    userId: {
      _id: string;
      username: string;
      avatarImage?: {
        key: string;
        url: string;
        publicUrl: string;
        bucket: string;
        size: number;
        contentType: string;
        mediaId: string;
      };
    };
  };
}

export interface ReportsResponse {
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReportsStats {
  total: number;
  pending: number;
  reviewed: number;
  resolved: number;
  dismissed: number;
  userReports: number;
  postReports: number;
}

export const useAdminGetAllReports = (
  page: number = 1,
  limit: number = 20,
  type?: 'post' | 'user',
  status?: string
) => {
  return useQuery<ReportsResponse>({
    queryKey: ['admin-reports', page, limit, type, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (type) params.append('type', type);
      if (status && status !== 'all') params.append('status', status);

      const { data } = await axiosInstance.get(
        `${ENDPOINTS.ADMIN.REPORTS.GET_ALL}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      return data.data;
    },
  });
};

export const useAdminGetReportsStats = () => {
  return useQuery<ReportsStats>({
    queryKey: ['admin-reports-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(ENDPOINTS.ADMIN.REPORTS.STATS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      return data.data;
    },
  });
};

export const useAdminGetReportById = (uuid: string) => {
  return useQuery<Report>({
    queryKey: ['admin-report', uuid],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        ENDPOINTS.ADMIN.REPORTS.GET_BY_UUID(uuid),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      return data.data;
    },
    enabled: !!uuid,
  });
};

export const useAdminUpdateReportStatus = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async ({
      uuid,
      status,
    }: {
      uuid: string;
      status: 'pending' | 'resolved' | 'dismissed';
    }) => {
      const { data } = await axiosInstance.patch(
        ENDPOINTS.ADMIN.REPORTS.UPDATE_STATUS(uuid),
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reports-stats'] });
      showSuccess('Success', 'Report status updated successfully');
    },
    onError: (error: Error) => {
      const err = error as unknown as {
        response?: { data?: { message?: string } };
      };
      showError(
        'Error',
        err?.response?.data?.message || 'Failed to update report status'
      );
    },
  });
};

export const useAdminDeleteReport = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (uuid: string) => {
      const { data } = await axiosInstance.delete(
        ENDPOINTS.ADMIN.REPORTS.DELETE(uuid),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reports-stats'] });
      showSuccess('Success', 'Report deleted successfully');
    },
    onError: (error: Error) => {
      const err = error as unknown as {
        response?: { data?: { message?: string } };
      };
      showError(
        'Error',
        err?.response?.data?.message || 'Failed to delete report'
      );
    },
  });
};
