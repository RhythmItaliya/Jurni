'use client';

import React from 'react';
import { PostCard } from '@/components/ui';
import CommentsPanel from './CommentsPanel';

/**
 * Main content area component with header layout
 * @returns {JSX.Element} Main content with header structure
 */
export default function MainContent() {
  const [openCommentsPostId, setOpenCommentsPostId] = React.useState<
    string | null
  >(null);

  return (
    <div
      className={`main-content ${openCommentsPostId ? 'layout-with-comments' : ''}`}
    >
      <div className="main-body">
        <div className="posts-list">
          {Array.from({ length: 10 }).map((_, idx) => {
            const demoPost = {
              _id: `p_internal_${idx + 1}`,
              id: `p${idx + 1}`,
              author: {
                _id: `u${idx + 1}`,
                username: `user_${idx + 1}`,
                fullName: `User ${idx + 1}`,
                avatar:
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
              },
              userId: {
                _id: `u${idx + 1}`,
                username: `user_${idx + 1}`,
              },
              title: `Demo Post ${idx + 1}`,
              description: '',
              media: [],
              hashtags: [],
              visibility: 'public' as const,
              allowComments: true,
              allowLikes: true,
              allowShares: true,
              status: 'active' as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            return (
              <PostCard
                key={`post-${idx + 1}`}
                post={demoPost}
                onComment={postId => {
                  // Toggle: if same post clicked -> close, otherwise open/switch
                  if (openCommentsPostId === postId) {
                    setOpenCommentsPostId(null);
                  } else {
                    setOpenCommentsPostId(postId);
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      <CommentsPanel
        postId={openCommentsPostId}
        onClose={() => setOpenCommentsPostId(null)}
      />
    </div>
  );
}
