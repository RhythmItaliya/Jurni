import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Hash, Star } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  description: string;
  media?: any[];
  userId?: {
    username?: string;
    _id?: string;
  };
  createdAt?: string;
}

const PostGridItem = ({ post, index }: { post: Post; index: number }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);

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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function TrendingContent() {
  const trendingTopics = [
    { name: '#photography', count: '2.1k posts' },
    { name: '#travel', count: '1.8k posts' },
    { name: '#foodie', count: '1.5k posts' },
    { name: '#nature', count: '1.2k posts' },
    { name: '#art', count: '980 posts' },
    { name: '#music', count: '850 posts' },
  ];

  // Mock popular posts data
  const popularPosts = [
    {
      _id: '1',
      title: 'Beautiful Sunset Photography',
      description:
        'Captured this amazing sunset during my travel to the mountains. The colors were absolutely breathtaking and I had to share this moment with everyone.',
      media: [
        {
          publicUrl:
            'https://placehold.co/400x400/ff6b6b/ffffff/png?text=Sunset',
          mediaType: 'image',
        },
        {
          publicUrl:
            'https://placehold.co/400x400/feca57/ffffff/png?text=Mountain+View',
          mediaType: 'image',
        },
      ],
      userId: { username: 'photographer123' },
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Delicious Food Art',
      description:
        'Created this beautiful food arrangement for dinner tonight. The presentation makes the meal even more enjoyable!',
      media: [
        {
          publicUrl:
            'https://placehold.co/400x400/feca57/ffffff/png?text=Food+Art',
          mediaType: 'image',
        },
      ],
      userId: { username: 'chef_master' },
      createdAt: new Date().toISOString(),
    },
    {
      _id: '3',
      title: 'Mountain Adventure',
      description:
        'Hiking through the mountains was an incredible experience. The fresh air and stunning views made every step worthwhile.',
      media: [
        {
          publicUrl:
            'https://placehold.co/400x400/48dbfb/ffffff/png?text=Mountain',
          mediaType: 'image',
        },
        {
          publicUrl:
            'https://placehold.co/400x400/2d5016/ffffff/png?text=Trail',
          mediaType: 'image',
        },
        {
          publicUrl: 'https://placehold.co/400x400/4a7c59/ffffff/png?text=Peak',
          mediaType: 'image',
        },
      ],
      userId: { username: 'adventure_seeker' },
      createdAt: new Date().toISOString(),
    },
    {
      _id: '4',
      title: 'Urban Art Gallery',
      description:
        'Exploring street art in the city center. Every corner tells a different story through vibrant colors and creative expressions.',
      media: [
        {
          publicUrl: 'https://placehold.co/400x400/2d5016/ffffff/png?text=Art',
          mediaType: 'image',
        },
      ],
      userId: { username: 'art_lover' },
      createdAt: new Date().toISOString(),
    },
    {
      _id: '5',
      title: "Nature's Beauty",
      description:
        'The forest was so peaceful and beautiful. Walking through the trees reminded me of how amazing our natural world is.',
      media: [
        {
          publicUrl:
            'https://placehold.co/400x400/4a7c59/ffffff/png?text=Nature',
          mediaType: 'image',
        },
      ],
      userId: { username: 'nature_lover' },
      createdAt: new Date().toISOString(),
    },
    {
      _id: '6',
      title: 'Music Festival Vibes',
      description:
        'Amazing concert experience with great music. The energy was electric and the crowd was incredible!',
      media: [
        {
          publicUrl:
            'https://placehold.co/400x400/9c88ff/ffffff/png?text=Music',
          mediaType: 'image',
        },
      ],
      userId: { username: 'music_fan' },
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <motion.div
      className="trending-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Trending Topics Section */}
      <motion.div
        className="trending-section"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="section-title">
          <Hash size={24} />
          Trending Topics
        </h2>
        <div className="trending-topics">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={topic.name}
              className="topic-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="topic-name">{topic.name}</span>
              <span className="topic-count">{topic.count}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Popular Posts Section */}
      <motion.div
        className="trending-section"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="section-title">
          <Star size={24} />
          Popular Posts
        </h2>
        <motion.div
          className="popular-posts-grid"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="post-grid">
            <AnimatePresence mode="popLayout">
              {popularPosts.map((post, index) => (
                <PostGridItem key={post._id} post={post} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
