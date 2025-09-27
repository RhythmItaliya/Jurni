'use client';

import { useState, useCallback } from 'react';
import { ToastProps, ToastType } from '@/components/ui/Toast';

interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

/**
 * Custom hook for managing toast notifications
 * @returns {Object} Toast management functions and state
 * @returns {ToastProps[]} toasts - Array of current toasts
 * @returns {Function} showToast - Function to show a new toast
 * @returns {Function} hideToast - Function to hide a specific toast
 * @returns {Function} clearAllToasts - Function to clear all toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  /**
   * Show a new toast notification
   * @param {ToastOptions} options - Toast configuration options
   * @param {ToastType} options.type - Type of toast (success, error, warning, info)
   * @param {string} options.title - Toast title
   * @param {string} [options.message] - Optional toast message
   * @param {number} [options.duration] - Auto-close duration in milliseconds (default: 5000)
   */
  const showToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      id,
      type: options.type,
      title: options.title,
      message: options.message,
      duration: options.duration || 5000,
      onClose: (id: string) => hideToast(id),
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  /**
   * Hide a specific toast by ID
   * @param {string} id - Toast ID to hide
   */
  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Show success toast
   * @param {string} title - Toast title
   * @param {string} [message] - Optional toast message
   * @param {number} [duration] - Auto-close duration in milliseconds
   */
  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'success', title, message, duration });
    },
    [showToast]
  );

  /**
   * Show error toast
   * @param {string} title - Toast title
   * @param {string} [message] - Optional toast message
   * @param {number} [duration] - Auto-close duration in milliseconds
   */
  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'error', title, message, duration });
    },
    [showToast]
  );

  /**
   * Show warning toast
   * @param {string} title - Toast title
   * @param {string} [message] - Optional toast message
   * @param {number} [duration] - Auto-close duration in milliseconds
   */
  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'warning', title, message, duration });
    },
    [showToast]
  );

  /**
   * Show info toast
   * @param {string} title - Toast title
   * @param {string} [message] - Optional toast message
   * @param {number} [duration] - Auto-close duration in milliseconds
   */
  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'info', title, message, duration });
    },
    [showToast]
  );

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useToast;
