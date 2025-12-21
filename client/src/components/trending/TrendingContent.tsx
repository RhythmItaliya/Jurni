import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Hash,
  Loader2,
  Share2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetTrendingPosts } from '@/hooks/useTrending';
import { PostData } from '@/types/post';
import { ShareModal } from '@/components/ui';

const PostGridItem = ({ post, index }: { post: PostData; index: number }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [showShareModal, setShowShareModal] = React.useState(false);

  const mediaItems = post.media || [];
  const hasMultipleMedia = mediaItems.length > 1;

  const postUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${post._id}`;

  const getMediaInfo = (mediaIndex: number = 0) => {
    if (!post.media || post.media.length === 0) {
      return {
        url: 'https://placehold.co/400x400/2d5016/ffffff/png?text=No+Media',
        type: 'image',
      };
    }

    const media = post.media[mediaIndex];
    const url =
      media?.publicUrl ||
      'https://placehold.co/400x400/2d5016/ffffff/png?text=No+Media';
    const mediaType = media?.mediaType || 'image';
    const isVideo = mediaType === 'video';

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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  return (
    <>
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
                <button
                  className="post-share-btn"
                  onClick={handleShare}
                  aria-label="Share post"
                >
                  <Share2 size={20} />
                </button>

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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={postUrl}
        title={post.title || 'Check out this post'}
      />
    </>
  );
};

export default function TrendingContent() {
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  const {
    data: trendingData,
    isLoading: postsLoading,
    error: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetTrendingPosts(8);

  const posts = React.useMemo(() => {
    return trendingData?.pages.flatMap(page => page.posts) || [];
  }, [trendingData]);

  React.useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <motion.div
      className="trending-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.div
        className="trending-section"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="section-title">
          <Hash size={24} />
          Trending Posts
        </h2>
        {postsLoading ? (
          <div className="trending-loading">
            <Loader2 className="spinner" size={32} />
            <p>Loading trending posts...</p>
          </div>
        ) : postsError ? (
          <p className="error-message">Failed to load trending posts</p>
        ) : posts.length > 0 ? (
          <motion.div
            className="popular-posts-grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="post-grid">
              <AnimatePresence mode="popLayout">
                {posts.map((post, index) => (
                  <PostGridItem key={post._id} post={post} index={index} />
                ))}
              </AnimatePresence>
            </div>

            {hasNextPage && (
              <div ref={loadMoreRef} className="trending-loading">
                {isFetchingNextPage && (
                  <>
                    <Loader2 className="spinner" size={32} />
                    <p>Loading more posts...</p>
                  </>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <p className="no-data">No trending posts found</p>
        )}
      </motion.div>
    </motion.div>
  );
}
