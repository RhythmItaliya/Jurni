import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { useReduxToast } from '@/hooks/useReduxToast';
import { extractServerMessage } from '@/lib/errorUtils';

// Query keys for consistent caching
export const adminKeys = {
  all: ['admin'] as const,
  list: () => [...adminKeys.all, 'list'] as const,
  detail: (uuid: string) => [...adminKeys.all, 'detail', uuid] as const,
  session: () => [...adminKeys.all, 'session'] as const,
};

// Types
export interface Admin {
  _id: string;
  uuid: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin';
  isActive: boolean;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginData {
  usernameOrEmail: string;
  password: string;
}

export interface AdminRegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'super_admin' | 'admin';
}

export interface UpdateAdminData {
  username?: string;
  email?: string;
  role?: 'super_admin' | 'admin';
  isActive?: boolean;
  permissions?: string[];
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Hook for admin login
 * Handles admin authentication and token storage
 *
 * @returns {UseMutationResult} Mutation object with login state and methods
 */
export function useAdminLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (data: AdminLoginData) => {
      const response = await api.post(ENDPOINTS.ADMIN.AUTH.LOGIN, data);
      return response.data.data;
    },
    onSuccess: data => {
      // Store admin token
      if (data.accessToken) {
        localStorage.setItem('adminToken', data.accessToken);
        localStorage.setItem('adminData', JSON.stringify(data.admin));

        // Set cookie for middleware (expires in 7 days)
        document.cookie = `adminToken=${data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
      }

      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      showSuccess('Login Successful', `Welcome back, ${data.admin.username}!`);
      router.push('/admin');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Login Failed', serverMessage || 'Invalid credentials');
    },
  });
}

/**
 * Hook for admin logout
 * Clears admin session and redirects to login
 *
 * @returns {Function} Logout function
 */
export function useAdminLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async () => {
      // Clear admin token and data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');

      // Clear admin cookie
      document.cookie =
        'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.clear();
      showSuccess('Logged Out', 'You have been logged out successfully');
      router.push('/admin/login');
    },
  });
}

/**
 * Hook for admin registration
 * Creates new admin account (super_admin only)
 *
 * @returns {UseMutationResult} Mutation object with registration state and methods
 */
export function useAdminRegister() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (data: AdminRegisterData) => {
      const response = await api.post(ENDPOINTS.ADMIN.AUTH.REGISTER, data);
      return response.data.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: adminKeys.list() });
      showSuccess(
        'Admin Created',
        `Admin ${data.admin.username} created successfully`
      );
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError(
        'Registration Failed',
        serverMessage || 'Failed to create admin'
      );
    },
  });
}

/**
 * Hook to get all admins
 * Fetches list of all admin accounts
 *
 * @returns {UseQueryResult} Query object with admins list
 */
export function useGetAdmins(enabled: boolean = true) {
  return useQuery({
    queryKey: adminKeys.list(),
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.ADMIN.ADMINS.GET_ALL);
      return response.data.data.admins || [];
    },
    enabled,
  });
}

/**
 * Hook to get admin by UUID
 * Fetches single admin account details
 *
 * @param {string} uuid - Admin UUID
 * @returns {UseQueryResult} Query object with admin details
 */
export function useGetAdmin(uuid: string) {
  return useQuery({
    queryKey: adminKeys.detail(uuid),
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.ADMIN.ADMINS.GET_BY_UUID(uuid));
      return response.data.data.admin;
    },
    enabled: !!uuid,
  });
}

/**
 * Hook to update admin
 * Updates admin account details
 *
 * @returns {UseMutationResult} Mutation object with update state and methods
 */
export function useUpdateAdmin() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async ({
      uuid,
      data,
    }: {
      uuid: string;
      data: UpdateAdminData;
    }) => {
      const response = await api.patch(
        ENDPOINTS.ADMIN.ADMINS.UPDATE(uuid),
        data
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.list() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.detail(variables.uuid),
      });
      showSuccess('Admin Updated', 'Admin details updated successfully');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Update Failed', serverMessage || 'Failed to update admin');
    },
  });
}

/**
 * Hook to change admin password
 * Updates admin password with current password verification
 *
 * @returns {UseMutationResult} Mutation object with password change state and methods
 */
export function useChangeAdminPassword() {
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async ({
      uuid,
      data,
    }: {
      uuid: string;
      data: ChangePasswordData;
    }) => {
      const response = await api.patch(
        ENDPOINTS.ADMIN.ADMINS.CHANGE_PASSWORD(uuid),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      showSuccess(
        'Password Changed',
        'Your password has been updated successfully'
      );
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError(
        'Password Change Failed',
        serverMessage || 'Failed to change password'
      );
    },
  });
}

/**
 * Hook to delete admin
 * Removes admin account from system
 *
 * @returns {UseMutationResult} Mutation object with delete state and methods
 */
export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await api.delete(ENDPOINTS.ADMIN.ADMINS.DELETE(uuid));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.list() });
      showSuccess('Admin Deleted', 'Admin account deleted successfully');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Delete Failed', serverMessage || 'Failed to delete admin');
    },
  });
}

/**
 * Hook to get current admin session
 * Retrieves admin data from localStorage
 *
 * @returns {UseQueryResult} Query object with current admin data
 */
export function useAdminSession() {
  return useQuery({
    queryKey: adminKeys.session(),
    queryFn: () => {
      const adminData = localStorage.getItem('adminData');
      return adminData ? JSON.parse(adminData) : null;
    },
    staleTime: Infinity,
  });
}

/**
 * Hook to check if user is authenticated as admin
 * Validates admin token existence
 *
 * @returns {UseQueryResult} Query object with authentication status
 */
export function useIsAdminAuthenticated() {
  return useQuery({
    queryKey: [...adminKeys.session(), 'auth-check'],
    queryFn: () => {
      const adminData = localStorage.getItem('adminData');
      const adminToken = localStorage.getItem('adminToken');
      return !!adminData && !!adminToken;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

// /**
//  * Hook to get current admin session data
//  * Returns parsed admin data from localStorage
//  *
//  * @returns {UseQueryResult} Query object with current admin data
//  */
// export function useAdminSession() {
//   return useQuery({
//     queryKey: adminKeys.session(),
//     queryFn: () => {
//       const adminData = localStorage.getItem('adminData');
//       return adminData ? JSON.parse(adminData) : null;
//     },
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });
// }
