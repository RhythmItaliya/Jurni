'use client';

import React from 'react';
import { PostCard } from '@/components/ui';
import CommentsPanel from './CommentsPanel';
import { useGetPosts } from '@/hooks/usePosts';
import { Spinner } from '@/components/ui';
import SkeletonPost from '@/components/ui/post/SkeletonPost';
import { PostData } from '@/types/post';

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

  // Only call useGetPosts when we actually need to show posts
  const postsQuery = showPosts ? useGetPosts() : null;
  const { data: postsData, isLoading, error } = postsQuery || {};
  const posts = postsData?.posts || [];

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
              {isLoading ? (
                // Show skeleton posts while loading
                Array.from({ length: 3 }).map((_, idx) => (
                  <SkeletonPost key={`skeleton-${idx}`} />
                ))
              ) : error ? (
                <div className="error-container">
                  <p>Failed to load posts. Please try again.</p>
                </div>
              ) : posts && posts.length > 0 ? (
                posts.map((post: PostData) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onComment={postId => {
                      // Toggle logic: if same post is clicked, close it; otherwise open the new post
                      if (openCommentsPostId === postId) {
                        setOpenCommentsPostId(null);
                      } else {
                        setOpenCommentsPostId(postId);
                      }
                    }}
                  />
                ))
              ) : (
                <div className="no-posts-container">
                  <p>No posts available.</p>
                </div>
              )}
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
