'use client';

import React from 'react';
import Image from 'next/image';

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
    return (
      <Image
        className={`author-avatar ${sizeClass} ${className}`}
        src={src}
        alt={alt || 'avatar'}
        width={size === 'sm' ? 32 : size === 'lg' ? 64 : 48}
        height={size === 'sm' ? 32 : size === 'lg' ? 64 : 48}
        style={{ borderRadius: '50%', objectFit: 'cover' }}
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
