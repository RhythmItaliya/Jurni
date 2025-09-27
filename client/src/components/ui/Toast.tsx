'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: '✓',
    iconBg: 'bg-green-100',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: '✕',
    iconBg: 'bg-red-100',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: '⚠',
    iconBg: 'bg-yellow-100',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'ℹ',
    iconBg: 'bg-blue-100',
  },
};

/**
 * Individual toast notification component
 * @param {ToastProps} props - Toast component props
 * @param {string} props.id - Unique identifier for the toast
 * @param {ToastType} props.type - Type of toast (success, error, warning, info)
 * @param {string} props.title - Toast title
 * @param {string} [props.message] - Optional toast message
 * @param {number} [props.duration] - Auto-close duration in milliseconds (default: 5000)
 * @param {Function} props.onClose - Callback function when toast is closed
 * @returns {JSX.Element} Toast notification component
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
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
      onClose(id);
    }, 300);
  };

  const styles = toastStyles[type];

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4
      `}
    >
      <div className="flex items-start">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center text-sm font-bold ${styles.text}`}
        >
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.text}`}>{title}</h3>
          {message && (
            <p className={`mt-1 text-sm ${styles.text} opacity-90`}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className={`ml-4 flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
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
 * Toast container component that renders toasts in a portal
 * @param {Object} props - ToastContainer props
 * @param {ToastProps[]} props.toasts - Array of toast objects
 * @param {Function} props.onClose - Callback function when toast is closed
 * @returns {JSX.Element} Toast container component
 */
export const ToastContainer: React.FC<{
  toasts: ToastProps[];
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>,
    document.body
  );
};

export default Toast;
