'use client';

import React from 'react';
import NextLink from 'next/link';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'danger'
    | 'forest'
    | 'warm'
    | 'sky'
    | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  external?: boolean;
}

/**
 * Reusable Link component with consistent styling
 * @param {LinkProps} props - Link component props
 * @param {string} props.href - Link destination
 * @param {React.ReactNode} props.children - Link content
 * @param {'primary' | 'secondary' | 'ghost' | 'danger'} [props.variant] - Link style variant
 * @param {'sm' | 'md' | 'lg'} [props.size] - Link size
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.external] - Whether link opens in new tab
 * @returns {JSX.Element} Link component
 */
export const Link: React.FC<LinkProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  external = false,
}) => {
  const linkClasses = `ui-link ${variant} ${size} ${className}`.trim();

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={linkClasses}>
      {children}
    </NextLink>
  );
};

export default Link;
