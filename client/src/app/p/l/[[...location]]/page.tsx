'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PostCard } from '@/components/ui';
import { useGetPostsByLocation } from '@/hooks/usePosts';
import { PostData } from '@/types/post';
import { PostMessage } from '@/components/post/PostNotFound';
import SkeletonPost from '@/components/ui/post/SkeletonPost';
import CommentsPanel from '@/components/layout/CommentsPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { useReduxToast } from '@/hooks/useReduxToast';

/**
 * Location posts page component
 * Displays posts filtered by a specific location
 * @returns {JSX.Element} Location posts page content
 */
export default function LocationPostsPage() {
  const params = useParams();
  const router = useRouter();
  const encodedLocation = (params.location as string[]).join('/');
  const location = decodeURIComponent(encodedLocation);
  const { data: session, status } = useSession();

  // Try to parse location as JSON to get display_name
  let displayLocation = location;
  try {
    const parsed = JSON.parse(location);
    if (parsed.display_name) {
      displayLocation = parsed.display_name;
    }
  } catch {
    // Not JSON, use as is
  }

  const [openCommentsPostId, setOpenCommentsPostId] = React.useState<
    string | null
  >(null);

  const { data, isLoading, error } = useGetPostsByLocation(location, {
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
          <div className="location-page-title">
            <h1>
              Posts from{' '}
              <span className="location-title-highlight">
                {displayLocation}
              </span>
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
