'use client';

import React from 'react';
import { PostCard } from '@/components/ui';

/**
 * Main content area component with header layout
 * @returns {JSX.Element} Main content with header structure
 */
export default function MainContent() {
  return (
    <div className="main-content">
      <div className="main-body">
        <div>
          {Array.from({ length: 10 }).map((_, idx) => (
            <PostCard
              key={`post-${idx + 1}`}
              post={{
                id: `p${idx + 1}`,
                author: { username: `user_${idx + 1}` },
                createdAt: new Date().toISOString(),
                text: '',
                media: [],
                likeCount: 0,
                commentCount: 0,
                isLiked: false,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
