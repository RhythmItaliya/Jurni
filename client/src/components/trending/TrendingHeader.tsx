import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Hash, Users, Eye } from 'lucide-react';

export default function TrendingHeader({
  title = 'Trending',
  subtitle = "Discover what's hot right now",
  totalPosts = 0,
  totalTopics = 0,
  totalViews = 0,
  totalUsers = 0,
}: {
  title?: string;
  subtitle?: string;
  totalPosts?: number;
  totalTopics?: number;
  totalViews?: number;
  totalUsers?: number;
}) {
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

        {/* Stats Grid */}
        <motion.div
          className="trending-stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">
              <Hash size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalPosts.toLocaleString()}</div>
              <div className="stat-label">Posts Today</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">
              <Users size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalUsers.toLocaleString()}</div>
              <div className="stat-label">Active Users</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">
              <TrendingUp size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalTopics.toLocaleString()}</div>
              <div className="stat-label">Trending Topics</div>
            </div>
          </motion.div>

          <motion.div
            className="stat-item"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">
              <Eye size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalViews.toLocaleString()}</div>
              <div className="stat-label">Total Views</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
