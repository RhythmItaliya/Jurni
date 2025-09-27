'use client';

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

/**
 * A simple round loading spinner component
 * @param {SpinnerProps} props - The component props
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.size - The size of the spinner (default: 'md')
 * @param {string} props.className - Additional CSS classes to apply
 * @returns {JSX.Element} The spinner component
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 ${sizeClasses[size]} ${className}`}
    />
  );
};

/**
 * A full-page loading component with centered spinner
 * @param {Object} props - The component props
 * @param {string} props.className - Additional CSS classes to apply
 * @returns {JSX.Element} The loading page component
 */
export const LoadingPage: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}
    >
      <Spinner size="xl" />
    </div>
  );
};

export default Spinner;
