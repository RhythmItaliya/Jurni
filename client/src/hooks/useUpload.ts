import { useMutation } from '@tanstack/react-query';
import { useReduxToast } from '@/hooks/useReduxToast';
import api from '../lib/axios';
import { ENDPOINTS } from '../lib/endpoints';
import type { AxiosError } from 'axios';

// Helper to extract a server-friendly message from axios errors or generic errors
function getServerMessage(error: unknown): string | undefined {
  if (error && typeof error === 'object') {
    const maybeAxios = error as AxiosError<Record<string, unknown>>;
    const resp = maybeAxios.response;
    if (resp && resp.data && typeof resp.data === 'object') {
      const d = resp.data as Record<string, unknown>;
      if ('message' in d && typeof d.message === 'string') return d.message;
      if ('error' in d && typeof d.error === 'string') return d.error;
      try {
        return JSON.stringify(d);
      } catch {
        return String(d);
      }
    }
  }
  return (error as { message?: string })?.message;
}

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
      const serverMessage = getServerMessage(error);
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
      const serverMessage = getServerMessage(error);
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
      const serverMessage = getServerMessage(error);
      showError('Upload Failed', serverMessage || 'An error occurred');
    },
  });
}
