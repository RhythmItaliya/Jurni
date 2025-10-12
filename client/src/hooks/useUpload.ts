import { useMutation } from '@tanstack/react-query';
import { useReduxToast } from '@/hooks/useReduxToast';
import api from '../lib/axios';
import { ENDPOINTS } from '../lib/endpoints';

/**
 * Hook to upload a single file
 */
export function useUploadSingle() {
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (args: {
      file: File;
      folder?: string;
      description?: string;
    }) => {
      const { file, folder, description } = args;
      const formData = new FormData();
      formData.append('file', file);
      if (folder) formData.append('folder', folder);
      if (description) formData.append('description', description);
      const response = await api.post(ENDPOINTS.UPLOAD.SINGLE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccess('Upload Complete', 'File uploaded successfully');
    },
    onError: error => {
      const serverMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as any).response?.data?.message ||
            (error as any).response?.data?.error ||
            String((error as any).response?.data)
          : (error as { message?: string })?.message;
      showError('Upload Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook to upload multiple files
 */
export function useUploadMultiple() {
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (args: {
      files: File[];
      folder?: string;
      postId?: string;
      description?: string;
    }) => {
      const { files, folder, postId, description } = args;
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      if (folder) formData.append('folder', folder);
      if (postId) formData.append('postId', postId);
      if (description) formData.append('description', description);
      const response = await api.post(ENDPOINTS.UPLOAD.MULTIPLE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccess('Upload Complete', 'Files uploaded successfully');
    },
    onError: error => {
      const serverMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as any).response?.data?.message ||
            (error as any).response?.data?.error ||
            String((error as any).response?.data)
          : (error as { message?: string })?.message;
      showError('Upload Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook to upload post media (multiple)
 */
export function useUploadPostMedia() {
  const { showError, showSuccess } = useReduxToast();

  return useMutation({
    mutationFn: async (args: { files: File[]; postId?: string }) => {
      const { files, postId } = args;
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      if (postId) formData.append('postId', postId);
      const response = await api.post(ENDPOINTS.UPLOAD.POST, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccess('Upload Complete', 'Post media uploaded successfully');
    },
    onError: error => {
      const serverMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as any).response?.data?.message ||
            (error as any).response?.data?.error ||
            String((error as any).response?.data)
          : (error as { message?: string })?.message;
      showError('Upload Failed', serverMessage || 'An error occurred');
    },
  });
}
