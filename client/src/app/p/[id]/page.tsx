'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PostCard } from '@/components/ui';
import { useGetPostById, useDeletePost } from '@/hooks/usePosts';
import { PostNotFound, PostMessage } from '@/components/post/PostNotFound';
import SkeletonPost from '@/components/ui/post/SkeletonPost';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2 } from 'lucide-react';
import CommentsPanel from '@/components/layout/CommentsPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { useReduxToast } from '@/hooks/useReduxToast';

/**
 * Post detail page component
 * Route: /p/[id]
 * Displays a single post with full details
 * @returns {JSX.Element} Post detail page content
 */
export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session, status } = useSession();

  const [openCommentsPostId, setOpenCommentsPostId] = React.useState<
    string | null
  >(null);

  const { data: post, isLoading, error } = useGetPostById(id);
  const deletePost = useDeletePost();
  const { showWarning } = useReduxToast();

  const isOwnPost = session?.user?.uuid === post?.userId?.uuid;

  const handleEdit = () => {
    router.push(`/p/edit/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost.mutate(id);
    }
  };

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
    return <SkeletonPost />;
  }

  if (error || !post) {
    // If it's a 404 (post not found), show PostNotFound regardless of auth status
    if ((error as Error & { isNotFound?: boolean })?.isNotFound) {
      return <PostNotFound postId={id} />;
    }

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
          description="You need to be logged in to view this post."
          buttonText="Login"
          buttonHref="/auth/login"
        />
      );
    }

    // For other errors, show PostNotFound as fallback
    return <PostNotFound postId={id} />;
  }

  return (
    <div className="page-content-in-main">
      <div
        className={`posts-with-comments-container post-detail-page ${openCommentsPostId ? 'with-comments' : ''}`}
      >
        <div className="posts-container">
          <PostCard
            post={post}
            onComment={postId => {
              if (status === 'unauthenticated') {
                showWarning(
                  'Login Required',
                  'You need to be logged in to view comments.'
                );
                return;
              }

              // Toggle logic: if same post is clicked, close it; otherwise open the new post
              if (openCommentsPostId === postId) {
                setOpenCommentsPostId(null);
              } else {
                setOpenCommentsPostId(postId);
              }
            }}
          />
          {isOwnPost && !openCommentsPostId && (
            <div className="post-owner-actions">
              <Button
                variant="outline"
                size="md"
                onClick={handleEdit}
                icon={<Edit size={16} />}
                iconPosition="left"
              >
                Edit Post
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleDelete}
                disabled={deletePost.isPending}
                icon={<Trash2 size={16} />}
                iconPosition="left"
              >
                {deletePost.isPending ? 'Deleting...' : 'Delete Post'}
              </Button>
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
                post={post}
                onClose={() => setOpenCommentsPostId(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
