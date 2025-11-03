'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLogout } from '@/hooks/useAuth';

export default function LeftSidebar({
  onMoreToggle,
}: {
  onMoreToggle?: () => void;
}) {
  const logoutMutation = useLogout();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => pathname === path;
  const isProfileActive = (username: string) =>
    pathname === `/${username}` || pathname.startsWith(`/${username}/`);

  return (
    <motion.div
      className={`left-sidebar ${isCollapsed ? 'left-sidebar--collapsed' : ''}`}
      animate={{ width: isCollapsed ? 60 : 240 }}
      transition={{ type: 'tween', duration: 0.2 }}
      layout
    >
      <div className="sidebar-top">
        {!isCollapsed && <div className="logo">Jurni</div>}
        <div className="sidebar-controls">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <svg width="20" height="20">
                <use href="/icons.svg#icon-arrow-right" />
              </svg>
            ) : (
              <svg width="20" height="20">
                <use href="/icons.svg#icon-arrow-left" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="sidebar-nav">
        <Link
          href="/"
          className={`nav-item ${isActive('/') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg width="20" height="20">
              <use href="/icons.svg#icon-home" />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Home</span>}
        </Link>
        <Link
          href="/profile"
          className={`nav-item ${isActive('/profile') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg width="20" height="20">
              <use href="/icons.svg#icon-profile" />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Profile</span>}
        </Link>
        <Link
          href="/trending"
          className={`nav-item ${isActive('/trending') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg width="20" height="20">
              <use href="/icons.svg#icon-trending" />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Trending</span>}
        </Link>
        <Link
          href="/upload"
          className={`nav-item ${isActive('/upload') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg width="20" height="20">
              <use href="/icons.svg#icon-upload" />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Upload</span>}
        </Link>
      </div>

      <div className="sidebar-bottom">
        {session?.user?.username && (
          <Link
            href={`/${session.user.username}`}
            className={`nav-item profile-item ${isProfileActive(session.user.username) ? 'nav-item-active' : ''}`}
          >
            <span className="nav-icon">
              <svg width="20" height="20">
                <use href="/icons.svg#icon-profile" />
              </svg>
            </span>
            {!isCollapsed && <span className="nav-text">My Profile</span>}
          </Link>
        )}
        <div className="nav-item" onClick={onMoreToggle}>
          <span className="nav-icon">
            <svg width="20" height="20">
              <use href="/icons.svg#icon-dots" />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">More</span>}
        </div>
        <div className="nav-item logout-item" onClick={handleLogout}>
          <span className="nav-icon">
            <svg width="20" height="20">
              <use href="/icons.svg#icon-logout" />
            </svg>
          </span>
          {!isCollapsed && (
            <span className="nav-text">
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
