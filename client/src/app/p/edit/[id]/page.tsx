'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PostCreationForm from '@/components/post/upload/PostCreationForm';
import { CreatePostData } from '@/types/post';
import { useGetPostById, useUpdatePost } from '@/hooks/usePosts';
import { PostNotFound, PostMessage } from '@/components/post/PostNotFound';
import SkeletonPost from '@/components/ui/post/SkeletonPost';

/**
 * Edit post page component
 * Route: /edit/[id]
 * Allows users to edit their own posts
 * @returns {JSX.Element} Edit post page content
 */
export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session, status } = useSession();

  const { data: post, isLoading, error } = useGetPostById(id);
  const updatePost = useUpdatePost();

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
          description="You need to be logged in to edit this post."
          buttonText="Login"
          buttonHref="/auth/login"
        />
      );
    }

    // For other errors, show PostNotFound as fallback
    return <PostNotFound postId={id} />;
  }

  // Check if user owns the post
  const isOwnPost = session?.user?.uuid === post.userId?.uuid;
  if (!isOwnPost) {
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
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        }
        title="Access Denied"
        description="You can only edit your own posts."
        buttonText="Go Back"
        buttonHref={`/p/${id}`}
      />
    );
  }

  const handleSubmit = async (postData: CreatePostData) => {
    try {
      await updatePost.mutateAsync({
        postId: id,
        data: postData,
      });

      // Success is handled by the hook's onSuccess callback
      router.push(`/p/${id}`);
    } catch (error) {
      // Error is handled by the hook's onError callback
      console.error('Failed to update post:', error);
    }
  };

  return (
    <PostCreationForm
      onSubmit={handleSubmit}
      loading={updatePost.isPending}
      error={updatePost.error?.message || null}
      initialData={post}
      isEdit={true}
    />
  );
}
