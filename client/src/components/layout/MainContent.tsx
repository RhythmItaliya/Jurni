'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostCard } from '@/components/ui';
import CommentsPanel from './CommentsPanel';
import { useGetPosts } from '@/hooks/usePosts';
import SkeletonPost from '@/components/ui/post/SkeletonPost';
import { PostData } from '@/types/post';

interface MainContentProps {
  showPosts: boolean;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Main content component - always same size, but content varies
 * @param showPosts - Whether to show actual posts or show page content
 * @param children - Page content to show when not showing posts
 * @returns {JSX.Element} Main content with posts or page content
 */
export default function MainContent({
  showPosts,
  children,
  fullWidth = false,
}: MainContentProps) {
  const [openCommentsPostId, setOpenCommentsPostId] = React.useState<
    string | null
  >(null);

  const postsQuery = useGetPosts();
  const { data: postsData, isLoading, error } = postsQuery;
  const posts = showPosts ? postsData?.posts || [] : [];

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
            <AnimatePresence>
              {openCommentsPostId && (
                <motion.div
                  key="comments-panel"
                  className="comments-container"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '400px', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <CommentsPanel
                    post={
                      posts.find(
                        (p: PostData) => p._id === openCommentsPostId
                      ) || null
                    }
                    onClose={() => setOpenCommentsPostId(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Show page content in the main area (same size as posts area)
          <div
            className={`page-content-in-main ${fullWidth ? 'page-content-in-main--full-width' : ''}`}
          >
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
