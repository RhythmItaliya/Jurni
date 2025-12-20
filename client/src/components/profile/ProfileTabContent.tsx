'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ShareModal } from '@/components/ui/ShareModal';

import { MediaObject } from '@/types/profile';

interface Post {
  _id: string;
  title: string;
  description: string;
  media?: MediaObject[];
  userId?: {
    username?: string;
    _id?: string;
  };
  createdAt?: string;
}

interface ProfileTabContentProps {
  posts: Post[];
  isLoading?: boolean;
  type: 'posts' | 'saved' | 'liked';
}

const PostGridItem = ({ post, index }: { post: Post; index: number }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  // Get all media items for this post
  const mediaItems = post.media || [];
  const hasMultipleMedia = mediaItems.length > 1;

  const getMediaInfo = (mediaIndex: number = 0) => {
    if (!post.media || post.media.length === 0) {
      return {
        url: 'https://placehold.co/400x400/2d5016/ffffff/png?text=No+Media',
        type: 'image',
      };
    }

    const media = post.media[mediaIndex];

    // Handle different response structures
    const url =
      media?.publicUrl ||
      media?.url ||
      media?.thumbnailUrl ||
      'https://placehold.co/400x400/2d5016/ffffff/png?text=No+Media';

    // Check mediaType field (from API response) or contentType or URL extension
    const mediaType = media?.mediaType || '';
    const contentType = media?.contentType || '';
    const isVideo =
      mediaType === 'video' ||
      contentType.startsWith('video/') ||
      url.match(/\.(mp4|webm|ogg|mov)$/i);

    return {
      url,
      type: isVideo ? 'video' : 'image',
    };
  };

  const { url: mediaUrl, type: mediaType } = getMediaInfo(currentMediaIndex);

  const handleClick = () => {
    router.push(`/p/${post._id}`);
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex(prev => (prev > 0 ? prev - 1 : mediaItems.length - 1));
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex(prev => (prev < mediaItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <motion.div
      className="post-grid-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="post-image-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMediaIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="media-container"
          >
            {mediaType === 'video' ? (
              <>
                <video
                  src={mediaUrl}
                  className="post-image"
                  muted
                  loop
                  playsInline
                  onMouseEnter={e => e.currentTarget.play()}
                  onMouseLeave={e => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="video-indicator">
                  <Play size={20} fill="white" />
                </div>
              </>
            ) : (
              <img
                src={mediaUrl}
                alt={post.title || 'Post'}
                className="post-image"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Media Navigation Arrows - Only show if multiple media */}
        {hasMultipleMedia && (
          <>
            <button
              className="media-nav-btn media-nav-prev"
              onClick={handlePrevMedia}
              aria-label="Previous media"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="media-nav-btn media-nav-next"
              onClick={handleNextMedia}
              aria-label="Next media"
            >
              <ChevronRight size={20} />
            </button>

            {/* Media Indicator Dots */}
            <div className="media-indicators">
              {mediaItems.map((_, idx) => (
                <button
                  key={idx}
                  className={`media-dot ${idx === currentMediaIndex ? 'active' : ''}`}
                  onClick={e => {
                    e.stopPropagation();
                    setCurrentMediaIndex(idx);
                  }}
                  aria-label={`Go to media ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="post-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="post-overlay-content">
                <motion.h3
                  className="post-title"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {post.title}
                </motion.h3>

                {post.description && (
                  <motion.p
                    className="post-description"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    {post.description.length > 100
                      ? `${post.description.substring(0, 100)}...`
                      : post.description}
                  </motion.p>
                )}

                {post.userId?.username && (
                  <motion.div
                    className="post-author"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    by @{post.userId.username}
                  </motion.div>
                )}

                <motion.button
                  className="post-share-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  onClick={e => {
                    e.stopPropagation();
                    setIsShareModalOpen(true);
                  }}
                  aria-label="Share post"
                >
                  <Share2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={
          typeof window !== 'undefined'
            ? `${window.location.origin}/p/${post._id}`
            : `/p/${post._id}`
        }
        title={post.title || post.description || 'Check out this post'}
      />
    </motion.div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="post-grid">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          className="post-grid-item skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="skeleton-image" />
        </motion.div>
      ))}
    </div>
  );
};

export default function ProfileTabContent({
  posts,
  isLoading = false,
  type,
}: ProfileTabContentProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return null; // ProfileEmpty will be shown instead
  }

  return (
    <motion.div
      className="profile-tab-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="post-grid">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <PostGridItem key={post._id} post={post} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
