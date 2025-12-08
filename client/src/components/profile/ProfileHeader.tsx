import React from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  Pencil,
  MapPin,
  Calendar,
  Lock,
  Globe,
  Mail,
  Heart,
  UserPlus,
} from 'lucide-react';
import { formatLocation, type LocationData } from '@/lib/locationUtils';
import { Button, UserReportModal } from '@/components/ui';
import {
  useFollowUser,
  useUnfollowUser,
  useFollowStatus,
} from '@/hooks/useFollow';
import { useReduxToast } from '@/hooks/useReduxToast';

export default function ProfileHeader({
  userId,
  username,
  bio,
  onEdit,
  coverImage,
  avatarImage,
  location,
  isPrivate,
  email,
  isEmailVerified,
  firstName,
  lastName,
  createdAt,
  totalPosts,
  totalLikes,
  totalSaves,
  totalSavedPosts,
  totalLikedPosts,
  followersCount,
  followingCount,
  isOwnProfile,
  onFollowersClick,
  onFollowingClick,
}: {
  userId?: string;
  username: string;
  bio?: string;
  onEdit?: () => void;
  coverImage?: string;
  avatarImage?: string;
  location?: LocationData | null;
  isPrivate?: boolean;
  email?: string;
  isEmailVerified?: boolean;
  firstName?: string | null;
  lastName?: string | null;
  createdAt?: string;
  totalPosts?: number;
  totalLikes?: number;
  totalSaves?: number;
  totalSavedPosts?: number;
  totalLikedPosts?: number;
  followersCount?: number;
  followingCount?: number;
  isOwnProfile?: boolean;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}) {
  const { data: session } = useSession();
  const { showInfo } = useReduxToast();
  const [isUserReportModalOpen, setIsUserReportModalOpen] =
    React.useState(false);

  // Fetch follow status if user is authenticated and not viewing own profile
  const { data: followStatus } = useFollowStatus(
    userId || '',
    !!(userId && session && !isOwnProfile)
  );

  // For unauthenticated users, assume not following
  const isFollowing = session ? followStatus?.isFollowing || false : false;

  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();
  const displayName =
    firstName || lastName
      ? `${firstName || ''} ${lastName || ''}`.trim()
      : username;

  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';
  return (
    <motion.div
      className="profile-header-modern"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Cover Image */}
      <motion.div
        className="profile-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={
          coverImage
            ? {
                backgroundImage: `url(${coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {}
        }
      />

      <div className="profile-header-content">
        {/* Avatar */}
        <motion.div
          className="profile-avatar-wrapper"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="profile-avatar">
            {avatarImage ? (
              <img
                src={avatarImage}
                alt={username}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  inset: 0,
                }}
              />
            ) : (
              <>
                <div className="avatar-gradient" />
                <div className="avatar-initial">
                  {username.charAt(0).toUpperCase()}
                </div>
              </>
            )}
          </div>
          <div className="avatar-status-indicator" />
        </motion.div>

        {/* Profile Info */}
        <motion.div
          className="profile-info-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="profile-name-row">
            <div className="profile-name-wrapper">
              <div>
                <h1 className="profile-username">{displayName}</h1>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.25rem',
                  }}
                >
                  @{username}
                </p>
              </div>
            </div>
            {onEdit && (
              <Button
                variant="outline"
                icon={<Pencil size={16} />}
                onClick={onEdit}
              >
                Edit Profile
              </Button>
            )}
            {!isOwnProfile && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="outline"
                  icon={<Heart size={16} />}
                  onClick={() => setIsUserReportModalOpen(true)}
                >
                  Report
                </Button>
                <Button
                  variant={isFollowing ? 'outline' : 'primary'}
                  icon={<UserPlus size={16} />}
                  onClick={() => {
                    if (!session) {
                      showInfo(
                        'Login Required',
                        'Please log in to follow users'
                      );
                      return;
                    }
                    if (userId) {
                      if (isFollowing) {
                        unfollowUserMutation.mutate(userId);
                      } else {
                        followUserMutation.mutate(userId);
                      }
                    }
                  }}
                  loading={
                    followUserMutation.isPending ||
                    unfollowUserMutation.isPending
                  }
                  loadingText="Loading..."
                  disabled={
                    session
                      ? followUserMutation.isPending ||
                        unfollowUserMutation.isPending
                      : false
                  }
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            )}
          </div>

          {/* Bio */}
          {bio && (
            <motion.p
              className="profile-bio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {bio}
            </motion.p>
          )}

          {/* Meta Info */}
          <motion.div
            className="profile-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {location && (
              <div className="profile-meta-item">
                <MapPin size={16} />
                <span>{formatLocation(location)}</span>
              </div>
            )}
            <div className="profile-meta-item">
              <Calendar size={16} />
              <span>Joined {joinDate}</span>
            </div>
            {email && (
              <div className="profile-meta-item">
                <Mail size={16} />
                <span>{email}</span>
              </div>
            )}
            <div className="profile-meta-item">
              {isPrivate ? (
                <>
                  <Lock size={16} />
                  <span>Private Profile</span>
                </>
              ) : (
                <>
                  <Globe size={16} />
                  <span>Public Profile</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="profile-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="stat-number">{totalPosts ?? 0}</div>
              <div className="stat-label">Posts</div>
            </motion.div>
            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
              onClick={onFollowersClick}
              style={{ cursor: onFollowersClick ? 'pointer' : 'default' }}
            >
              <div className="stat-number">{followersCount ?? 0}</div>
              <div className="stat-label">Followers</div>
            </motion.div>
            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
              onClick={onFollowingClick}
              style={{ cursor: onFollowingClick ? 'pointer' : 'default' }}
            >
              <div className="stat-number">{followingCount ?? 0}</div>
              <div className="stat-label">Following</div>
            </motion.div>
            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="stat-number">{totalLikes ?? 0}</div>
              <div className="stat-label">Likes Received</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* User Report Modal */}
      {userId && (
        <UserReportModal
          isOpen={isUserReportModalOpen}
          onClose={() => setIsUserReportModalOpen(false)}
          userId={userId}
          username={username}
          isOwnProfile={isOwnProfile || false}
        />
      )}
    </motion.div>
  );
}
