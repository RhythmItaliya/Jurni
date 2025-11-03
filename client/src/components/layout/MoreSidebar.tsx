'use client';
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface MoreSidebarProps {
  onClose?: () => void;
}

export default function MoreSidebar({ onClose }: MoreSidebarProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="left-sidebar more-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-controls">
          <button
            className="sidebar-toggle"
            onClick={onClose}
            aria-label="Close more sidebar"
          >
            <svg width="20" height="20">
              <use href="/icons.svg#icon-close" />
            </svg>
          </button>
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-item">
          <span className="nav-icon">
            <svg width="20" height="20">
              <use href="/icons.svg#icon-profile" />
            </svg>
          </span>
          <span className="nav-text">Privacy</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">
            <svg width="20" height="20">
              <use href="/icons.svg#icon-upload" />
            </svg>
          </span>
          <span className="nav-text">Terms</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">
            <svg width="20" height="20">
              <use href="/icons.svg#icon-heart" />
            </svg>
          </span>
          <span className="nav-text">Notifications</span>
        </div>
        <div className="nav-item theme-item" onClick={toggleTheme}>
          <span className="nav-icon">
            <ThemeToggle />
          </span>
          <span className="nav-text">
            {theme === 'light' ? 'Dark' : 'Light'}
          </span>
        </div>
      </div>
    </div>
  );
}
