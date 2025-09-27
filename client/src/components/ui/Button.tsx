'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'travel'
    | 'explore';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  primary: 'bg-forest hover:bg-forest/90 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-sage hover:bg-sage/90 text-white shadow-lg hover:shadow-xl',
  outline:
    'border-2 border-forest text-forest hover:bg-forest hover:text-white',
  ghost: 'text-forest hover:bg-cream',
  travel:
    'bg-gradient-travel hover:opacity-90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
  explore:
    'bg-gradient-sunset hover:opacity-90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
        rounded-lg font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        active:scale-95
      `}
    >
      {children}
    </button>
  );
};

export default Button;
