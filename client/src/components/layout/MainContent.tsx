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
              onComment={postId => {
                setOpenCommentsPostId(postId);
              }}
            />
          ))}
        </div>
      </div>

      <CommentsPanel
        postId={openCommentsPostId}
        onClose={() => setOpenCommentsPostId(null)}
      />
    </div>
  );
}
