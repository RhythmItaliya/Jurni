import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Bookmark, Heart, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileEmpty({ type }: { type: string }) {
  const router = useRouter();

  const config = {
    videos: {
      icon: Grid,
      title: 'No posts yet',
      message: 'Share your first post with the world',
      action: 'Create Post',
      onAction: () => router.push('/upload'),
    },
    favourites: {
      icon: Bookmark,
      title: 'No saved posts',
      message: 'Posts you save will appear here',
      action: null,
    },
    liked: {
      icon: Heart,
      title: 'No liked posts yet',
      message: 'Posts you like will appear here',
      action: null,
    },
  };

  const current = config[type as keyof typeof config] || config.videos;
  const Icon = current.icon;

  return (
    <motion.div
      className="profile-empty-modern"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="empty-icon-wrapper"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
      >
        <div className="empty-icon-bg" />
        <Icon size={64} className="empty-icon" />
      </motion.div>

      <motion.h3
        className="empty-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {current.title}
      </motion.h3>

      <motion.p
        className="empty-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {current.message}
      </motion.p>

      {current.action && current.onAction && (
        <motion.button
          className="empty-action-btn"
          onClick={current.onAction}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          <span>{current.action}</span>
        </motion.button>
      )}
    </motion.div>
  );
}
