'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { PostCard } from '@/components/ui';
import { useGetPostById } from '@/hooks/usePosts';
import { PostNotFound } from '@/components/post/PostNotFound';
import MainContent from '@/components/layout/MainContent';
import SkeletonPost from '@/components/ui/post/SkeletonPost';

/**
 * Post detail page component
 * Route: /p/[id]
 * Displays a single post with full details using MainContent layout
 * @returns {JSX.Element} Post detail page content
 */
export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: post, isLoading, error } = useGetPostById(id);

  if (isLoading) {
    return (
      <MainContent showPosts={false}>
        <SkeletonPost />
      </MainContent>
    );
  }

  if (error || !post) {
    return (
      <MainContent showPosts={false}>
        <PostNotFound postId={id} />
      </MainContent>
    );
  }

  return (
    <MainContent showPosts={false}>
      <PostCard
        post={post}
        onComment={() => {
          console.log('Comment clicked for post:', post._id);
        }}
      />
    </MainContent>
  );
}
