import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { useReduxToast } from '@/hooks/useReduxToast';
import { extractServerMessage } from '@/lib/errorUtils';

// Query keys for consistent caching
export const adminUsersKeys = {
  all: ['admin', 'users'] as const,
  list: () => [...adminUsersKeys.all, 'list'] as const,
  detail: (uuid: string) => [...adminUsersKeys.all, 'detail', uuid] as const,
};

// Types
export interface AdminUser {
  uuid: string;
  username: string;
  email: string;
  isActive: boolean;
  isSuspended: boolean;
  otpVerifiedAt?: Date;
  avatarImage?: {
    key: string;
    url: string;
    publicUrl: string;
    bucket: string;
    size?: number;
    contentType?: string;
    mediaId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: AdminUser | AdminUser[];
}

export interface UpdateUserData {
  isSuspended?: boolean;
  isActive?: boolean;
}

/**
 * Hook for fetching all users for admin
 * Retrieves complete user information for admin dashboard
 *
 * @returns {UseQueryResult} Query object with users data and loading states
 */
export function useAdminGetAllUsers() {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: adminUsersKeys.list(),
    queryFn: async () => {
      try {
        const response = await api.get<AdminUsersResponse>(
          ENDPOINTS.ADMIN.USERS.GET_ALL
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        return response.data.data as AdminUser[];
      } catch (error) {
        const message = extractServerMessage(error) || 'Failed to fetch users';
        showError('Error', message);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching a single user by UUID for admin
 * Retrieves complete user information
 *
 * @param uuid - User UUID
 * @returns {UseQueryResult} Query object with user data and loading states
 */
export function useAdminGetUserByUuid(uuid: string | null) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: uuid ? adminUsersKeys.detail(uuid) : ['disabled'],
    queryFn: async () => {
      if (!uuid) {
        throw new Error('UUID is required');
      }

      try {
        const response = await api.get<AdminUsersResponse>(
          ENDPOINTS.ADMIN.USERS.GET_BY_UUID(uuid)
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        return response.data.data as AdminUser;
      } catch (error) {
        const message = extractServerMessage(error) || 'Failed to fetch user';
        showError('Error', message);
        throw error;
      }
    },
    enabled: !!uuid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for updating a user (suspend/unsuspend/activate/deactivate)
 * Mutates user status fields
 *
 * @returns {UseMutationResult} Mutation object with update state and methods
 */
export function useAdminUpdateUser() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async ({
      uuid,
      data,
    }: {
      uuid: string;
      data: UpdateUserData;
    }) => {
      const response = await api.patch<AdminUsersResponse>(
        ENDPOINTS.ADMIN.USERS.UPDATE(uuid),
        data
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data as AdminUser;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch both list and detail queries
      queryClient.invalidateQueries({
        queryKey: adminUsersKeys.list(),
      });
      queryClient.invalidateQueries({
        queryKey: adminUsersKeys.detail(variables.uuid),
      });

      showSuccess('Success', 'User updated successfully');
    },
    onError: error => {
      const message = extractServerMessage(error) || 'Failed to update user';
      showError('Error', message);
    },
  });
}

/**
 * Hook for deleting a user
 * Removes user from the system
 *
 * @returns {UseMutationResult} Mutation object with delete state and methods
 */
export function useAdminDeleteUser() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await api.delete<AdminUsersResponse>(
        ENDPOINTS.ADMIN.USERS.DELETE(uuid)
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate users list query
      queryClient.invalidateQueries({
        queryKey: adminUsersKeys.list(),
      });

      showSuccess('Success', 'User deleted successfully');
    },
    onError: error => {
      const message = extractServerMessage(error) || 'Failed to delete user';
      showError('Error', message);
    },
  });
}
