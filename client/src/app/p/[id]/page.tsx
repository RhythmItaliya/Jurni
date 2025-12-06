'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { useSession } from 'next-auth/react';
import { PostCard } from '@/components/ui';
import { useGetPostById } from '@/hooks/usePosts';
import { PostNotFound, PostMessage } from '@/components/post/PostNotFound';
import SkeletonPost from '@/components/ui/post/SkeletonPost';

/**
 * Post detail page component
 * Route: /p/[id]
 * Displays a single post with full details
 * @returns {JSX.Element} Post detail page content
 */
export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { status } = useSession();

  const { data: post, isLoading, error } = useGetPostById(id);

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
    if ((error as any)?.isNotFound) {
      return <PostNotFound postId={id} />;
    }

    // If it's an auth error or user is not authenticated, show login required
    if ((error as any)?.isAuthError || status === 'unauthenticated') {
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
    <PostCard
      post={post}
      onComment={() => {
        console.log('Comment clicked for post:', post._id);
      }}
    />
  );
}
