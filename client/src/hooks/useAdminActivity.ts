import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

export interface ActivityUser {
  username: string;
  email: string;
  avatarImage?: {
    publicUrl: string;
  };
}

export interface ActivityItem {
  type: 'user' | 'post';
  action: 'created_account' | 'created_post';
  user: ActivityUser | null;
  post?: {
    _id: string;
    title: string;
  };
  timestamp: string;
}

/**
 * Hook to get recent activity
 */
export const useAdminGetRecentActivity = (options?: {
  limit?: number;
  type?: 'all' | 'users' | 'posts';
}) => {
  return useQuery<ActivityItem[], Error>({
    queryKey: ['admin-activity', options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', String(options.limit));
      if (options?.type) params.append('type', options.type);

      const url = `${ENDPOINTS.ADMIN.ACTIVITY}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        return response.data.data.activities;
      }
      throw new Error(response.data.message || 'Failed to fetch activity');
    },
  });
};
