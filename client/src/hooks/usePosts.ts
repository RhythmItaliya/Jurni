import { useState, useCallback } from 'react';
import { CreatePostData, PostData, UploadResponse } from '@/types/post';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '@/lib/postsApi';
import { uploadPostMedia } from '@/lib/uploadApi';

/**
 * Custom hook for managing posts
 */
export const usePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new post with optional media upload
   */
  const handleCreatePost = useCallback(async (
    postData: CreatePostData,
    mediaFiles?: File[]
  ): Promise<PostData | null> => {
    setLoading(true);
    setError(null);

    try {
      let mediaUrls: any[] = [];

      // Upload media files if provided
      if (mediaFiles && mediaFiles.length > 0) {
        const uploadResult = await uploadPostMedia(mediaFiles);
        
        if (uploadResult.success && uploadResult.data) {
          // Handle single file response
          if ('url' in uploadResult.data) {
            mediaUrls = [{
              url: uploadResult.data.url,
              type: uploadResult.data.mediaType,
            }];
          }
          // Handle multiple files response (bulk upload)
          else if ('successful' in (uploadResult.data as any)) {
            const bulkData = uploadResult.data as any;
            mediaUrls = bulkData.successful.map((item: any) => ({
              url: item.url,
              type: item.mediaType,
            }));
          }
        }
      }

      // Create post with media URLs
      const finalPostData = {
        ...postData,
        media: mediaUrls.length > 0 ? mediaUrls : postData.media,
      };

      const response = await createPost(finalPostData);
      
      if (response.success && response.data) {
        return response.data as PostData;
      }

      throw new Error(response.error || 'Failed to create post');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch posts with optional filtering
   */
  const handleGetPosts = useCallback(async (query?: any): Promise<PostData[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPosts(query);
      
      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          return response.data;
        } else if ('posts' in response.data) {
          return response.data.posts;
        }
      }

      throw new Error(response.error || 'Failed to fetch posts');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single post by ID
   */
  const handleGetPostById = useCallback(async (postId: string): Promise<PostData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPostById(postId);
      
      if (response.success && response.data) {
        return response.data as PostData;
      }

      throw new Error(response.error || 'Post not found');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch post';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a post
   */
  const handleUpdatePost = useCallback(async (
    postId: string,
    updateData: Partial<CreatePostData>
  ): Promise<PostData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await updatePost(postId, updateData);
      
      if (response.success && response.data) {
        return response.data as PostData;
      }

      throw new Error(response.error || 'Failed to update post');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a post
   */
  const handleDeletePost = useCallback(async (postId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await deletePost(postId);
      
      if (response.success) {
        return true;
      }

      throw new Error(response.error || 'Failed to delete post');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createPost: handleCreatePost,
    getPosts: handleGetPosts,
    getPostById: handleGetPostById,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
  };
};