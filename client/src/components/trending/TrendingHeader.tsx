import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Hash, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetTrendingHashtags } from '@/hooks/useTrending';

export default function TrendingHeader({
  title = 'Trending',
  subtitle = "Discover what's hot right now",
}: {
  title?: string;
  subtitle?: string;
}) {
  const router = useRouter();
  const { data: trendingHashtags, isLoading: hashtagsLoading } =
    useGetTrendingHashtags(10);

  // Format hashtags for display - limit to top 10
  const formattedHashtags =
    trendingHashtags?.slice(0, 10).map(h => ({
      hashtag: h.hashtag,
      name: `#${h.hashtag}`,
      count: `${h.count} post${h.count !== 1 ? 's' : ''}`,
    })) || [];

  const handleTopicClick = (hashtag: string) => {
    router.push(`/p/h/${hashtag}`);
  };

  return (
    <motion.div
      className="trending-header-compact"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="trending-header-content">
        {/* Title Section */}
        <motion.div
          className="trending-title-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="trending-icon">
            <TrendingUp size={32} />
          </div>
          <div className="trending-text">
            <h1 className="trending-title">{title}</h1>
            <p className="trending-subtitle">{subtitle}</p>
          </div>
        </motion.div>

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
          {hashtagsLoading ? (
            <div className="trending-loading">
              <Loader2 className="spinner" size={32} />
              <p>Loading trending topics...</p>
            </div>
          ) : formattedHashtags.length > 0 ? (
            <div className="trending-topics">
              {formattedHashtags.map((topic, index) => (
                <motion.div
                  key={topic.name}
                  className="topic-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleTopicClick(topic.hashtag)}
                >
                  <span className="topic-name">{topic.name}</span>
                  <span className="topic-count">{topic.count}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="no-data">No trending topics found</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
