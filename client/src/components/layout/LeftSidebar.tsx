'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  ChevronRight,
  ChevronLeft,
  Home,
  User,
  TrendingUp,
  Upload,
  Search,
  MoreHorizontal,
  LogOut,
} from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';

export default function LeftSidebar({
  onMoreToggle,
}: {
  onMoreToggle?: () => void;
}) {
  const logoutMutation = useLogout();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
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
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
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
            <Home size={20} />
          </span>
          {!isCollapsed && <span className="nav-text">Home</span>}
        </Link>
        <Link
          href="/profile"
          className={`nav-item ${isActive('/profile') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <User size={20} />
          </span>
          {!isCollapsed && <span className="nav-text">Profile</span>}
        </Link>
        <Link
          href="/trending"
          className={`nav-item ${isActive('/trending') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <TrendingUp size={20} />
          </span>
          {!isCollapsed && <span className="nav-text">Trending</span>}
        </Link>
        <Link
          href="/upload"
          className={`nav-item ${isActive('/upload') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <Upload size={20} />
          </span>
          {!isCollapsed && <span className="nav-text">Upload</span>}
        </Link>
        <Link
          href="/search"
          className={`nav-item ${isActive('/search') ? 'nav-item-active' : ''}`}
        >
          <span className="nav-icon">
            <Search size={20} />
          </span>
          {!isCollapsed && <span className="nav-text">Search</span>}
        </Link>
      </div>

      <div className="sidebar-bottom">
        {session?.user?.username && (
          <Link
            href={`/${session.user.username}`}
            className={`nav-item profile-item ${isProfileActive(session.user.username) ? 'nav-item-active' : ''}`}
          >
            <span className="nav-icon">
              <User size={20} />
            </span>
            {!isCollapsed && <span className="nav-text">My Profile</span>}
          </Link>
        )}
        <div className="nav-item" onClick={onMoreToggle}>
          <span className="nav-icon">
            <MoreHorizontal size={20} />
          </span>
          {!isCollapsed && <span className="nav-text">More</span>}
        </div>
        <div className="nav-item theme-item" onClick={toggleTheme}>
          <span className="nav-icon">
            <ThemeToggle />
          </span>
          {!isCollapsed && (
            <span className="nav-text">
              {theme === 'light' ? 'Dark' : 'Light'}
            </span>
          )}
        </div>
        <div className="nav-item logout-item" onClick={handleLogout}>
          <span className="nav-icon">
            <LogOut size={20} />
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
