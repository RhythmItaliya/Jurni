'use client';

import React, { createContext, useContext } from 'react';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

interface ToastContextType {
  toasts: any[];
  showToast: (options: any) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast provider component for managing toast notifications
 * @param {Object} props - ToastProvider props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Toast provider component
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.hideToast} />
    </ToastContext.Provider>
  );
};

/**
 * Hook to use toast context
 * @returns {ToastContextType} Toast context value
 * @throws {Error} If used outside of ToastProvider
 */
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
