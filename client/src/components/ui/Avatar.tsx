'use client';

import React from 'react';

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function Avatar({
  src,
  alt,
  size = 'md',
  className = '',
}: AvatarProps) {
  const sizeClass = `avatar-${size}`;

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        className={`author-avatar ${sizeClass} ${className}`}
        src={src}
        alt={alt || 'avatar'}
      />
    );
  }

  return (
    <div
      className={`author-avatar author-avatar-fallback ${sizeClass} ${className}`}
    >
      {(alt || 'U').charAt(0).toUpperCase()}
    </div>
  );
}
