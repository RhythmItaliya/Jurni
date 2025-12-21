'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminLogout, useAdminSession } from '@/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { Logo } from '@/components/ui/Logo';
import {
  ChevronRight,
  ChevronLeft,
  Home,
  Users,
  FileText,
  MessageCircle,
  Image,
  Flag,
  Shield,
  Settings,
  Moon,
  Sun,
  LogOut,
  LogIn,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const adminLogout = useAdminLogout();
  const { data: currentAdmin } = useAdminSession();
  const { theme, toggleTheme } = useTheme();

  const isSuperAdmin = currentAdmin?.role === 'super_admin';

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
        {!isCollapsed && <Logo variant="auto" size="sm" />}
        <div className="sidebar-controls">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
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
            <Home size={20} />
          </span>
          {!isCollapsed && <span className="nav-text">Dashboard</span>}
        </Link>
        {isSuperAdmin && (
          <Link
            href="/admin/users"
            className={`nav-item ${
              isActive('/admin/users') ? 'nav-item-active' : ''
            }`}
          >
            <span className="nav-icon">
              <Users size={20} />
            </span>
            {!isCollapsed && <span className="nav-text">Users</span>}
          </Link>
        )}
        <Link
          href="/admin/comments"
          className={`nav-item ${isActive('/admin/comments') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <MessageCircle size={20} />
          </span>
          {!isCollapsed && <span className="nav-text">Comments</span>}
        </Link>
        <Link
          href="/admin/reports"
          className={`nav-item ${isActive('/admin/reports') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <Flag size={20} />
          </span>
          {!isCollapsed && <span className="nav-text">Reports</span>}
        </Link>
        {isSuperAdmin && (
          <Link
            href="/admin/admins"
            className={`nav-item ${isActive('/admin/admins') ? 'nav-item-active' : ''}`}
          >
            <span className="nav-icon">
              <Shield size={20} />
            </span>
            {!isCollapsed && <span className="nav-text">Admins</span>}
          </Link>
        )}
        <Link
          href="/admin/settings"
          className={`nav-item ${isActive('/admin/settings') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <Settings size={20} />
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
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
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
            <LogOut size={20} />
          </span>
          {!isCollapsed && (
            <span className="nav-text">
              {adminLogout.isPending ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </button>
        <Link href="/" className="nav-item">
          <span className="nav-icon">
            <LogIn size={20} />
          </span>
          {!isCollapsed && <span className="nav-text">Exit to Site</span>}
        </Link>
      </div>
    </motion.div>
  );
}
