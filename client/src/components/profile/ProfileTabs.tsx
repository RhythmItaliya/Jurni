import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Heart, Bookmark, Grid } from 'lucide-react';

const tabs = [
  { label: 'Posts', key: 'videos', icon: Grid },
  { label: 'Saved', key: 'favourites', icon: Bookmark },
  { label: 'Liked', key: 'liked', icon: Heart },
];

export default function ProfileTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (key: string) => void;
}) {
  return (
    <div className="profile-tabs-modern">
      <div className="tabs-wrapper">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

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
