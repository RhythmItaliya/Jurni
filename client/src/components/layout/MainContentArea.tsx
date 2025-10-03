'use client';

import React from 'react';
import { PostCard } from '@/components/ui';

interface MainContentAreaProps {
  showPosts: boolean;
  children?: React.ReactNode;
}

/**
 * Main content area component - always same size, but content varies
 * @param showPosts - Whether to show actual posts or show page content
 * @param children - Page content to show when not showing posts
 * @returns {JSX.Element} Main content area with posts or page content
 */
export default function MainContentArea({
  showPosts,
  children,
}: MainContentAreaProps) {
  return (
    <div className="main-content">
      <div className="main-body">
        {showPosts ? (
          // Show actual posts (only for home route)
          <div className="posts-container">
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
        ) : (
          // Show page content in the main area (same size as posts area)
          <div className="page-content-in-main">
            {children || (
              <div className="blank-placeholder">
                {/* This maintains the same size as the posts area */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
