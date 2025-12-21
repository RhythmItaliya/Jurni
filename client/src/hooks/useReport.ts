import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useReduxToast } from './useReduxToast';
import { ENDPOINTS } from '@/lib/endpoints';

export interface ReportPayload {
  reportType: 'post' | 'user';
  reportedId: string;
  reason:
    | 'spam'
    | 'harassment'
    | 'inappropriate_content'
    | 'copyright_violation'
    | 'fake_account'
    | 'other';
  description?: string;
}

export interface Report {
  _id: string;
  reporterId: string;
  reportType: 'post' | 'user';
  reportedId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const useReportPost = () => {
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (payload: ReportPayload) => {
      const response = await axiosInstance.post<Report>(
        ENDPOINTS.REPORTS.CREATE,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      showSuccess(
        'Report Submitted',
        'Thank you for helping us keep the platform safe.'
      );
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to submit report';
      showError('Report Failed', message);
    },
  });
};

export const useReportUser = () => {
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (payload: ReportPayload) => {
      const response = await axiosInstance.post<Report>(
        ENDPOINTS.REPORTS.CREATE,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      showSuccess(
        'Report Submitted',
        'Thank you for helping us keep the platform safe.'
      );
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to submit report';
      showError('Report Failed', message);
    },
  });
};
