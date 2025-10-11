import api from './axios';
import { ENDPOINTS } from './endpoints';
import { UploadResponse } from '@/types/post';

/**
 * Upload API service functions
 */

/**
 * Upload a single file
 */
export const uploadSingle = async (
  file: File,
  folder?: string,
  description?: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (folder) formData.append('folder', folder);
  if (description) formData.append('description', description);

  const response = await api.post(ENDPOINTS.UPLOAD.SINGLE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Upload multiple files
 */
export const uploadMultiple = async (
  files: File[],
  folder?: string,
  postId?: string,
  description?: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  if (folder) formData.append('folder', folder);
  if (postId) formData.append('postId', postId);
  if (description) formData.append('description', description);

  const response = await api.post(ENDPOINTS.UPLOAD.MULTIPLE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Upload post media
 */
export const uploadPostMedia = async (
  files: File[],
  postId?: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });
  
  if (postId) formData.append('postId', postId);

  const response = await api.post(ENDPOINTS.UPLOAD.POST, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(ENDPOINTS.UPLOAD.PROFILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Upload audio file
 */
export const uploadAudio = async (
  file: File,
  folder?: string,
  description?: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (folder) formData.append('folder', folder);
  if (description) formData.append('description', description);

  const response = await api.post(ENDPOINTS.UPLOAD.AUDIO, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Delete uploaded file
 */
export const deleteFile = async (key: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(ENDPOINTS.UPLOAD.DELETE, {
    data: { key },
  });

  return response.data;
};

/**
 * Generate presigned upload URL for direct client upload
 */
export const generateUploadUrl = async (
  filename: string,
  contentType: string,
  folder?: string,
  expiresIn?: number
): Promise<{
  uploadUrl: string;
  key: string;
  publicUrl: string;
}> => {
  const response = await api.post(ENDPOINTS.UPLOAD.GENERATE_URL, {
    filename,
    contentType,
    folder,
    expiresIn,
  });

  return response.data.data;
};

/**
 * Get upload service health status
 */
export const getUploadHealth = async (): Promise<any> => {
  const response = await api.get(ENDPOINTS.UPLOAD.HEALTH);
  return response.data;
};

/**
 * Get upload connection info
 */
export const getUploadConnectionInfo = async (): Promise<any> => {
  const response = await api.get(ENDPOINTS.UPLOAD.CONNECTION_INFO);
  return response.data;
};

/**
 * Get upload statistics
 */
export const getUploadStats = async (): Promise<any> => {
  const response = await api.get(ENDPOINTS.UPLOAD.STATS);
  return response.data;
};