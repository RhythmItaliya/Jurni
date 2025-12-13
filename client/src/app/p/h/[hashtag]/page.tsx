'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PostCard } from '@/components/ui';
import { useGetPostsByHashtag } from '@/hooks/usePosts';
import { PostData } from '@/types/post';
import { PostMessage } from '@/components/post/PostNotFound';
import SkeletonPost from '@/components/ui/post/SkeletonPost';
import CommentsPanel from '@/components/layout/CommentsPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { useReduxToast } from '@/hooks/useReduxToast';

/**
 * Hashtag posts page component
 * Displays posts filtered by a specific hashtag
 * @returns {JSX.Element} Hashtag posts page content
 */
export default function HashPostsPage() {
  const params = useParams();
  const router = useRouter();
  const rawHashtag = params.hashtag as string;
  // Decode URL-encoded hashtag (e.g., 'lord_buddha' instead of 'lord%20buddha')
  const hashtag = rawHashtag ? decodeURIComponent(rawHashtag) : '';
  const { data: session, status } = useSession();

  const [openCommentsPostId, setOpenCommentsPostId] = React.useState<
    string | null
  >(null);

  const { data, isLoading, error } = useGetPostsByHashtag(hashtag, {
    query: { page: 1, limit: 10 },
  });
  const { showWarning } = useReduxToast();

  if (status === 'loading' || isLoading) {
    if (status === 'unauthenticated') {
      return (
        <div className="post-not-found">
          <div className="post-not-found__container">
            <SkeletonPost />
          </div>
        </div>
      );
    }
    return (
      <>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonPost key={index} />
        ))}
      </>
    );
  }

  if (error) {
    // If it's an auth error or user is not authenticated, show login required
    if (
      (error as Error & { isAuthError?: boolean })?.isAuthError ||
      status === 'unauthenticated'
    ) {
      return (
        <PostMessage
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          }
          title="Login Required"
          description="You need to be logged in to view posts."
          buttonText="Login"
          buttonHref="/auth/login"
        />
      );
    }

    // For other errors, show generic error message
    return (
      <PostMessage
        title="Failed to Load Posts"
        description="We couldn't load the posts. Please try again later."
        buttonText="Try Again"
        buttonHref="/"
      />
    );
  }

  const posts = data?.posts || [];

  return (
    <div className="page-content-in-main">
      <div
        className={`posts-with-comments-container post-detail-page ${openCommentsPostId ? 'with-comments' : ''}`}
      >
        <div className="posts-container">
          <div className="hashtag-page-title">
            <h1>
              Posts tagged with{' '}
              <span className="hashtag-title-highlight">#{hashtag}</span>
            </h1>
          </div>
          {posts.map((post: PostData) => (
            <PostCard
              key={post._id}
              post={post}
              onComment={postId => {
                if (status === 'unauthenticated') {
                  showWarning(
                    'Login Required',
                    'You need to be logged in to view comments.'
                  );
                  return;
                }

                if (openCommentsPostId === postId) {
                  setOpenCommentsPostId(null);
                } else {
                  setOpenCommentsPostId(postId);
                }
              }}
            />
          ))}
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
                  posts.find((p: PostData) => p._id === openCommentsPostId) ||
                  null
                }
                onClose={() => setOpenCommentsPostId(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
