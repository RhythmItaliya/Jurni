'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

const toastIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
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
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      dispatch(removeToast(id));
    }, 300);
  }, [dispatch, id]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  return (
    <div className={`toast ${type} ${isLeaving ? 'leaving' : ''}`}>
      <div className="toast-content">
        <div className="toast-icon">{toastIcons[type]}</div>
        <div className="toast-text">
          <h3>{title}</h3>
          {message && <p>{message}</p>}
        </div>
        <button onClick={handleClose} className="toast-close">
          <span className="sr-only">Close</span>
          <svg fill="currentColor" viewBox="0 0 20 20">
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
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
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
