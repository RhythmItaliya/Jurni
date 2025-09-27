'use client';

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

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
  return <div className={`spinner ${size} ${className}`} />;
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
    <div className={`loading-page ${className}`}>
      <Spinner size="xl" />
    </div>
  );
};

export default Spinner;
