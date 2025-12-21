'use client';

import Link from 'next/link';
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'auto',
  size = 'md',
  href = '/',
  className = '',
}) => {
  const { theme } = useTheme();

  // Determine the actual variant based on theme
  const actualVariant =
    variant === 'auto' ? (theme === 'dark' ? 'light' : 'dark') : variant;

  const sizeClasses = {
    sm: 'logo-sm',
    md: 'logo-md',
    lg: 'logo-lg',
  };

  const variantClasses = {
    light: 'logo-light',
    dark: 'logo-dark',
  };

  return (
    <Link
      href={href}
      className={`logo ${sizeClasses[size]} ${variantClasses[actualVariant]} ${className}`}
    >
      <span className="logo-text">Jurni</span>
    </Link>
  );
};
