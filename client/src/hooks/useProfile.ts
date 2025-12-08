import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReduxToast } from '@/hooks/useReduxToast';
import {
  UpdateProfileData,
  PublicProfile,
  CompleteProfile,
} from '@/types/profile';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { extractServerMessage } from '@/lib/errorUtils';

// Query keys for profile cache
export const profileKeys = {
  all: ['profiles'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
};

/**
 * Hook to fetch the current user's complete profile for editing
 * Retrieves all user and profile data including firstName, lastName, email, etc.
 *
 * @description
 * - Fetches profile from GET /profiles/me endpoint (authenticated)
 * - Returns complete profile data (user + profile combined)
 * - Used to populate edit form with existing values
 * - Shows error toast on failure
 *
 * @usedIn
 * - Profile edit page to load default form values
 * - Any component needing current user's full profile
 *
 * @returns {UseQueryResult} Query object with complete profile data and loading state
 */
export function useGetMyProfile(enabled = true) {
  const { showError } = useReduxToast();

  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: async () => {
      try {
        const response = await api.get<{
          success: boolean;
          message: string;
          data: CompleteProfile;
        }>(ENDPOINTS.PROFILES.GET_ME);

        if (!response.data.data) {
          throw new Error('No profile data returned');
        }

        return response.data.data;
      } catch (error) {
        const errorMessage =
          extractServerMessage(error) || 'Failed to fetch profile';
        showError('Error', errorMessage);
        throw error; // Re-throw to let React Query handle the error state
      }
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}

/**
 * Hook to fetch public profile by username
 * Retrieves complete user and profile data for any user by username
 *
 * @description
 * - Fetches profile from GET /profiles/public/:username endpoint
 * - Returns complete profile data (user + profile combined)
 * - No authentication required
 * - Shows error toast on failure
 *
 * @param username - Username to fetch profile for
 * @param enabled - Whether to enable the query (default: true)
 *
 * @usedIn
 * - Public profile pages
 * - User profile views
 * - Profile preview components
 *
 * @returns {UseQueryResult} Query object with complete profile data and loading state
 */
export function useGetPublicProfile(username: string, enabled = true) {
  return useQuery({
    queryKey: [...profileKeys.all, 'public', username],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: CompleteProfile;
      }>(ENDPOINTS.PROFILES.PUBLIC(username));

      if (!response.data.data) {
        throw new Error('No profile data returned');
      }

      return response.data.data;
    },
    enabled: enabled && !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to update the current user's profile
 * Handles profile updates including bio, cover image, location, privacy settings
 *
 * @description
 * - Makes PATCH request to /profiles endpoint
 * - Sends only provided fields for update
 * - Supports profile image uploads
 * - Invalidates profile cache on success
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - ProfileEditForm component for updating profile
 * - Settings page for profile management
 *
 * @returns {UseMutationResult} Mutation object with update state and methods
 *
 * @example
 * ```tsx
 * const { mutate: updateProfile, isPending } = useUpdateProfile();
 *
 * const handleSubmit = (data: UpdateProfileData) => {
 *   updateProfile(data);
 * };
 * ```
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await api.patch<{
        success: boolean;
        message: string;
        data: PublicProfile;
      }>(ENDPOINTS.PROFILES.UPDATE, data);
      return response.data.data;
    },
    onSuccess: data => {
      // Invalidate all profile queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      showSuccess(
        'Profile Updated',
        'Your profile has been updated successfully'
      );
    },
    onError: (error: unknown) => {
      const message = extractServerMessage(error);
      showError('Update Failed', message || 'Failed to update profile');
    },
  });
}

/**
 * Hook to update profile with file uploads (cover image, avatar)
 * Handles multipart form data for profile updates with files
 *
 * @description
 * - Creates FormData with profile data and files
 * - Makes multipart PATCH request to /profiles endpoint
 * - Handles cover image and avatar uploads
 * - Invalidates profile cache on success
 * - Shows success/error toast notifications
 *
 * @usedIn
 * - ProfileEditForm when uploading cover/avatar images
 * - Image crop/upload components
 *
 * @returns {UseMutationResult} Mutation object with update state and methods
 *
 * @example
 * ```tsx
 * const { mutate: updateWithFiles } = useUpdateProfileWithFiles();
 *
 * const handleSubmit = (data: UpdateProfileData, coverFile?: File, avatarFile?: File) => {
 *   updateWithFiles({ profileData: data, coverImage: coverFile, avatarImage: avatarFile });
 * };
 * ```
 */
export function useUpdateProfileWithFiles() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (data: {
      profileData: UpdateProfileData;
      coverImage?: File | null;
      avatarImage?: File | null;
    }) => {
      const formData = new FormData();

      // Add profile data fields
      if (data.profileData.firstName !== undefined) {
        formData.append('firstName', data.profileData.firstName);
      }
      if (data.profileData.lastName !== undefined) {
        formData.append('lastName', data.profileData.lastName);
      }
      if (data.profileData.bio !== undefined) {
        formData.append('bio', data.profileData.bio);
      }
      if (data.profileData.location) {
        formData.append('location', JSON.stringify(data.profileData.location));
      }
      if (data.profileData.isPrivate !== undefined) {
        formData.append('isPrivate', data.profileData.isPrivate.toString());
      }

      // Add cover image file if provided
      if (data.coverImage) {
        formData.append('coverImage', data.coverImage);
      }

      // Add avatar image file if provided
      if (data.avatarImage) {
        formData.append('avatarImage', data.avatarImage);
      }

      const response = await api.patch<{
        success: boolean;
        message: string;
        data: PublicProfile;
      }>(ENDPOINTS.PROFILES.UPDATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    },
    onSuccess: data => {
      // Invalidate all profile queries
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      showSuccess(
        'Profile Updated',
        'Your profile and images have been updated successfully'
      );
    },
    onError: (error: unknown) => {
      const message = extractServerMessage(error);
      showError(
        'Update Failed',
        message || 'Failed to update profile with files'
      );
    },
  });
}
