'use client';

import { SuggestionsPanel } from '@/components/suggestions';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import UserListPanel from './UserListPanel';
import { useGetFollowers, useGetFollowing } from '@/hooks/useFollow';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { closeSidebar } from '@/store/slices/sidebarSlice';

/**
 * Right sidebar component
 * Displays dynamic content based on Redux state
 * @returns {JSX.Element} Right sidebar layout component
 */
export default function RightSidebar() {
  const dispatch = useAppDispatch();
  const { contentType, userId } = useAppSelector(state => state.sidebar);

  const { data: followers, isLoading: followersLoading } = useGetFollowers(
    userId || '',
    contentType === 'followers' && !!userId
  );
  const { data: following, isLoading: followingLoading } = useGetFollowing(
    userId || '',
    contentType === 'following' && !!userId
  );

  const handleClose = () => {
    dispatch(closeSidebar());
  };

  const renderContent = () => {
    switch (contentType) {
      case 'followers':
        return (
          <>
            <div className="sidebar-panel__header">
              <h3>Followers</h3>
              <button onClick={handleClose} className="sidebar-panel__close">
                <X size={20} />
              </button>
            </div>
            <UserListPanel
              users={followers}
              isLoading={followersLoading}
              emptyMessage="No followers yet"
            />
          </>
        );

      case 'following':
        return (
          <>
            <div className="sidebar-panel__header">
              <h3>Following</h3>
              <button onClick={handleClose} className="sidebar-panel__close">
                <X size={20} />
              </button>
            </div>
            <UserListPanel
              users={following}
              isLoading={followingLoading}
              emptyMessage="Not following anyone yet"
            />
          </>
        );

      default:
        return <SuggestionsPanel />;
    }
  };

  return (
    <div className="right-sidebar">
      <div style={{ padding: '1rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={contentType}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
