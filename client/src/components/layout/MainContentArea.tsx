'use client';

import React from 'react';
import { PostCard } from '@/components/ui';
import CommentsPanel from './CommentsPanel';

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
  const [openCommentsPostId, setOpenCommentsPostId] = React.useState<
    string | null
  >(null);

  return (
    <div
      className={`main-content ${openCommentsPostId ? 'layout-with-comments' : ''}`}
    >
      <div className="main-body">
        {showPosts ? (
          // Show actual posts with comments panel side by side
          <div
            className={`posts-with-comments-container ${openCommentsPostId ? 'with-comments' : ''}`}
          >
            <div className="posts-container">
              {Array.from({ length: 10 }).map((_, idx) => (
                <PostCard
                  key={`post-${idx + 1}`}
                  post={{
                    _id: `p_internal_${idx + 1}`,
                    id: `p${idx + 1}`,
                    author: {
                      _id: `u${idx + 1}`,
                      username: `user_${idx + 1}`,
                    },
                    userId: {
                      _id: `u${idx + 1}`,
                      username: `user_${idx + 1}`,
                    },
                    title: `Demo Post ${idx + 1}`,
                    description: `This is demo content for post ${idx + 1}`,
                    hashtags: ['demo', 'test'],
                    visibility: 'public' as const,
                    allowComments: true,
                    allowLikes: true,
                    allowShares: true,
                    status: 'active' as const,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }}
                  onComment={postId => {
                    // Toggle logic: if same post is clicked, close it; otherwise open the new post
                    if (openCommentsPostId === postId) {
                      setOpenCommentsPostId(null);
                    } else {
                      setOpenCommentsPostId(postId);
                    }
                  }}
                />
              ))}
            </div>
            {openCommentsPostId && (
              <div className="comments-container">
                <CommentsPanel
                  postId={openCommentsPostId}
                  onClose={() => setOpenCommentsPostId(null)}
                />
              </div>
            )}
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
