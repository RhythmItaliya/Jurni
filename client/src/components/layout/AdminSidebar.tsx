'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminLogout } from '@/hooks';
import { useTheme } from '@/contexts/ThemeContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const adminLogout = useAdminLogout();
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    adminLogout.mutate();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <motion.div
      className={`left-sidebar ${isCollapsed ? 'left-sidebar--collapsed' : ''}`}
      animate={{ width: isCollapsed ? 60 : 240 }}
      transition={{ type: 'tween', duration: 0.2 }}
      layout
    >
      <div className="sidebar-top">
        {!isCollapsed && <div className="logo">Admin</div>}
        <div className="sidebar-controls">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="sidebar-nav">
        <Link
          href="/admin"
          className={`nav-item ${isActive('/admin') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Dashboard</span>}
        </Link>
        <Link
          href="/admin/users"
          className={`nav-item ${isActive('/admin/users') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Users</span>}
        </Link>
        <Link
          href="/admin/posts"
          className={`nav-item ${isActive('/admin/posts') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Posts</span>}
        </Link>
        <Link
          href="/admin/comments"
          className={`nav-item ${isActive('/admin/comments') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Comments</span>}
        </Link>
        <Link
          href="/admin/media"
          className={`nav-item ${isActive('/admin/media') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Media</span>}
        </Link>
        <Link
          href="/admin/reports"
          className={`nav-item ${isActive('/admin/reports') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Reports</span>}
        </Link>
        <Link
          href="/admin/admins"
          className={`nav-item ${isActive('/admin/admins') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Admins</span>}
        </Link>
        <Link
          href="/admin/settings"
          className={`nav-item ${isActive('/admin/settings') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Settings</span>}
        </Link>
      </div>

      <div className="sidebar-footer">
        <button
          onClick={toggleTheme}
          className="nav-item"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="nav-icon">
            {theme === 'light' ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m6.364 1.636l-.707.707M21 12h-1m1.364 6.364l-.707-.707M12 21v-1m-6.364-1.636l.707-.707M3 12h1M3.636 5.636l.707.707"
                />
                <circle cx="12" cy="12" r="5" />
              </svg>
            )}
          </span>
          {!isCollapsed && (
            <span className="nav-text">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          )}
        </button>
        <button
          onClick={handleLogout}
          className="nav-item"
          disabled={adminLogout.isPending}
        >
          <span className="nav-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </span>
          {!isCollapsed && (
            <span className="nav-text">
              {adminLogout.isPending ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </button>
        <Link href="/" className="nav-item">
          <span className="nav-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </span>
          {!isCollapsed && <span className="nav-text">Exit to Site</span>}
        </Link>
      </div>
    </motion.div>
  );
}
