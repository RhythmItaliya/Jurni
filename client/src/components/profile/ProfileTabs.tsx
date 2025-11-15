import React from 'react';
import { motion } from 'framer-motion';

const tabs = [
  { label: 'Videos', key: 'videos' },
  { label: 'Favourites', key: 'favourites' },
  { label: 'Liked', key: 'liked' },
];

export default function ProfileTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (key: string) => void;
}) {
  return (
    <div className="tabsRow">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? 'activeTab' : 'tab'}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
