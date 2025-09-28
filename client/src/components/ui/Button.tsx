'use client';

import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'travel'
    | 'explore'
    | 'forest'
    | 'nature'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'danger'
    | 'neutral'
    | 'light'
    | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  effect?: 'shine' | 'glow' | 'pulse' | 'none';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  effect = 'none',
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  loading = false,
  loadingText,
}) => {
  const effectClass = effect !== 'none' ? effect : '';

  const renderContent = () => {
    if (loading) {
      return (
        <div className="button-loading-content">
          <span className="button-spinner">
            <Spinner size="sm" />
          </span>
          <span className="button-text">{loadingText || children}</span>
        </div>
      );
    }

    if (!icon) {
      return children;
    }

    const iconElement = (
      <span
        className="button-icon"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          marginRight: iconPosition === 'left' ? '0.5rem' : '0',
          marginLeft: iconPosition === 'right' ? '0.5rem' : '0',
        }}
      >
        {icon}
      </span>
    );

    return (
      <>
        {iconPosition === 'left' && iconElement}
        <span className="button-text">{children}</span>
        {iconPosition === 'right' && iconElement}
      </>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`button ${variant} ${size} ${effectClass} ${loading ? 'loading' : ''} ${className}`.trim()}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
