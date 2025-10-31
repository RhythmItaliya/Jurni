'use client';

import PostCreationForm from '@/components/post/upload/PostCreationForm';
import { useRouter } from 'next/navigation';
import { CreatePostData } from '@/types/post';
import { useCreatePostWithMedia } from '@/hooks/usePosts';

/**
 * Upload page component - allows users to create and upload new posts
 * Layout: Left Sidebar (navigation) + This page content (NO right sidebar)
 * NO posts from MainContent - this is separate page content
 * @returns {JSX.Element} Upload page content
 */
export default function UploadPage() {
  const router = useRouter();
  const createPostWithMedia = useCreatePostWithMedia();

  const handleSubmit = async (
    postData: CreatePostData,
    mediaFiles?: File[]
  ) => {
    try {
      await createPostWithMedia.mutateAsync({
        postData,
        files: mediaFiles,
      });

      // Success is handled by the hook's onSuccess callback
      router.push('/');
    } catch (error) {
      // Error is handled by the hook's onError callback
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="upload-page">
      <PostCreationForm
        onSubmit={handleSubmit}
        loading={createPostWithMedia.isPending}
        error={createPostWithMedia.error?.message || null}
      />
    </div>
  );
}
