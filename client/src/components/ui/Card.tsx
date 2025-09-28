'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'flat' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  interactive?: boolean;
  loading?: boolean;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

/**
 * Card component with multiple variants and styling options
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  color = 'default',
  interactive = false,
  loading = false,
  className = '',
}) => {
  const cardClasses = [
    'card',
    variant !== 'default' ? `card-${variant}` : '',
    size !== 'md' ? `card-${size}` : '',
    color !== 'default' ? `card-${color}` : '',
    interactive ? 'card-interactive' : '',
    loading ? 'card-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={cardClasses}>{children}</div>;
};

/**
 * Card header component
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => {
  return <div className={`card-header ${className}`}>{children}</div>;
};

/**
 * Card body component
 */
export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  return <div className={`card-body ${className}`}>{children}</div>;
};

/**
 * Card footer component
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  align = 'start',
  className = '',
}) => {
  const footerClasses = [
    'card-footer',
    align !== 'start' ? `card-footer-${align}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={footerClasses}>{children}</div>;
};

export default Card;
