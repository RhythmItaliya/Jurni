import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Grid } from 'lucide-react';

const tabs = [
  { label: 'Posts', key: 'posts', icon: Grid },
  { label: 'Saved', key: 'saved', icon: Bookmark },
  { label: 'Liked', key: 'liked', icon: Heart },
];

export default function ProfileTabs({
  activeTab,
  onTabChange,
  totalPosts,
  totalSavedPosts,
  totalLikedPosts,
}: {
  activeTab: string;
  onTabChange: (key: string) => void;
  totalPosts?: number;
  totalSavedPosts?: number;
  totalLikedPosts?: number;
}) {
  const getCounts = (key: string) => {
    switch (key) {
      case 'posts':
        return totalPosts ?? 0;
      case 'saved':
        return totalSavedPosts ?? 0;
      case 'liked':
        return totalLikedPosts ?? 0;
      default:
        return 0;
    }
  };
  return (
    <div className="profile-tabs-modern">
      <div className="tabs-wrapper">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = getCounts(tab.key);

          return (
            <motion.button
              key={tab.key}
              className={`tab-button ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab.key)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
              <span className="tab-count">{count}</span>
              {isActive && (
                <motion.div
                  className="tab-indicator"
                  layoutId="activeTab"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
