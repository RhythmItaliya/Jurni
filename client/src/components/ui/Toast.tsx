'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeToast } from '@/store/slices/toastSlice';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const toastStyles = {
  success: {
    bg: 'bg-white',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: '✓',
    iconBg: 'bg-green-500',
    iconText: 'text-white',
  },
  error: {
    bg: 'bg-white',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: '✕',
    iconBg: 'bg-red-500',
    iconText: 'text-white',
  },
  warning: {
    bg: 'bg-white',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: '⚠',
    iconBg: 'bg-yellow-500',
    iconText: 'text-white',
  },
  info: {
    bg: 'bg-white',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'ℹ',
    iconBg: 'bg-blue-500',
    iconText: 'text-white',
  },
};

/**
 * Individual toast notification component with Redux integration
 * @param {ToastProps} props - Toast component props
 * @param {string} props.id - Unique identifier for the toast
 * @param {ToastType} props.type - Type of toast (success, error, warning, info)
 * @param {string} props.title - Toast title
 * @param {string} [props.message] - Optional toast message
 * @param {number} [props.duration] - Auto-close duration in milliseconds (default: 5000)
 * @returns {JSX.Element} Toast notification component
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
}) => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      dispatch(removeToast(id));
    }, 300);
  };

  const styles = toastStyles[type];

  return (
    <div
      className={`
        relative max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 mb-3
      `}
    >
      <div className="flex items-start">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center text-sm font-bold ${styles.iconText}`}
        >
          {styles.icon}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${styles.text} leading-tight`}>
            {title}
          </h3>
          {message && (
            <p
              className={`mt-1 text-sm ${styles.text} opacity-90 leading-relaxed`}
            >
              {message}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className={`ml-3 flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-black hover:bg-opacity-10`}
        >
          <span className="sr-only">Close</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * Toast container component that renders toasts from Redux store
 * @returns {JSX.Element} Toast container component
 */
export const ToastContainer: React.FC = () => {
  const toasts = useAppSelector(state => state.toast.toasts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-h-screen overflow-hidden">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="transform transition-all duration-300 ease-in-out"
          style={{
            zIndex: 50 - index,
          }}
        >
          <Toast {...toast} />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default Toast;
