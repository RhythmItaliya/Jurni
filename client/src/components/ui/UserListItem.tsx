'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useFollowUser, useUnfollowUser } from '@/hooks/useFollow';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/store/hooks';
import { closeSidebar } from '@/store/slices/sidebarSlice';

interface UserListItemProps {
  user: {
    uuid?: string;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarImage?: string | null;
    isFollowing?: boolean;
  };
  index: number;
}

export default function UserListItem({ user, index }: UserListItemProps) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const fullName =
    user.firstName || user.lastName
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : null;

  // Use isFollowing from API response
  const isFollowing = user.isFollowing === true;

  const { mutate: followUser, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending } =
    useUnfollowUser();

  const handleFollowClick = () => {
    if (user.uuid) {
      if (isFollowing) {
        unfollowUser(user.uuid);
      } else {
        followUser(user.uuid);
      }
    }
  };

  const handleUserClick = () => {
    dispatch(closeSidebar());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="user-list-item"
    >
      <Link
        href={`/j/${user.username}`}
        className="user-list-item__link"
        onClick={handleUserClick}
      >
        <div className="user-list-item__avatar">
          {user.avatarImage ? (
            <img src={user.avatarImage} alt={user.username} />
          ) : (
            <span>{user.username?.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="user-list-item__info">
          <div className="user-list-item__username">{user.username}</div>
          {fullName && <div className="user-list-item__name">{fullName}</div>}
        </div>
      </Link>
      {session && (
        <Button
          variant={isFollowing ? 'outline' : 'primary'}
          size="sm"
          onClick={handleFollowClick}
          disabled={isFollowPending || isUnfollowPending}
          loading={isFollowPending || isUnfollowPending}
          className="user-list-item__button"
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </motion.div>
  );
}
