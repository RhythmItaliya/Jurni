'use client';

import PostCreationForm from '@/components/ui/PostCreationForm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatePostData } from '@/types/post';
import { createPost } from '@/lib/postsApi';

/**
 * Upload page component - allows users to create and upload new posts
 * Layout: Left Sidebar (navigation) + This page content (NO right sidebar)
 * NO posts from MainContent - this is separate page content
 * @returns {JSX.Element} Upload page content
 */
export default function UploadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (postData: CreatePostData) => {
    try {
      setIsSubmitting(true);
      console.log('Creating post:', postData);
      
      const newPost = await createPost(postData);
      console.log('Post created successfully:', newPost);
      
      // Redirect to the user's profile or home page
      router.push('/');
    } catch (error) {
      console.error('Failed to create post:', error);
      // Error handling is done within the PostCreationForm component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="container">
        <PostCreationForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
