'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  useSuggestions,
  useTrendingHashtags,
  SuggestedUser,
} from '@/hooks/useSuggestions';
import { useFollowUser } from '@/hooks/useFollow';
import '@/styles/components/suggestions.scss';

/**
 * Suggestions Panel Component
 * Displays suggested users and trending hashtags in the right sidebar
 * Shows follow buttons for quick actions
 */
export default function SuggestionsPanel() {
  const router = useRouter();
  const { data: suggestedUsers, isLoading: usersLoading } = useSuggestions(8);
  const { data: trendingHashtags, isLoading: hashtagsLoading } =
    useTrendingHashtags(8);
  const { mutate: followUser, isPending: isFollowPending } = useFollowUser();

  const handleFollowClick = (userId: string) => {
    followUser(userId);
  };

  const handleVisitProfile = (username: string) => {
    router.push(`/j/${username}`);
  };

  const handleHashtagClick = (hashtag: string) => {
    router.push(`/p/h/${encodeURIComponent(hashtag)}`);
  };

  return (
    <motion.div
      className="suggestions-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Suggested Users Section */}
      <div className="suggestions-section">
        <h3 className="section-title">Suggested For You</h3>

        {usersLoading ? (
          <div className="suggestions-loading">
            <div className="skeleton" style={{ height: '60px' }} />
            <div className="skeleton" style={{ height: '60px' }} />
            <div className="skeleton" style={{ height: '60px' }} />
          </div>
        ) : suggestedUsers && suggestedUsers.length > 0 ? (
          <div className="suggestions-list">
            {suggestedUsers.map((user: SuggestedUser) => (
              <motion.div
                key={user._id}
                className="suggestion-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ backgroundColor: 'var(--bg-hover)' }}
              >
                {/* Avatar and Info */}
                <div
                  className="card-left"
                  onClick={() => handleVisitProfile(user.username)}
                >
                  <img
                    src={
                      user.avatarImage?.publicUrl ||
                      user.avatarImage?.url ||
                      '/default-avatar.png'
                    }
                    alt={user.username}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <p className="user-name">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.username}
                    </p>
                    <p className="user-handle">@{user.username}</p>
                    {user.bio && (
                      <p className="user-bio">{user.bio.substring(0, 40)}...</p>
                    )}
                  </div>
                </div>

                {/* Follow Button */}
                <motion.button
                  className="follow-btn"
                  onClick={() => handleFollowClick(user._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isFollowPending}
                >
                  {isFollowPending ? 'Following...' : 'Follow'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="no-suggestions">No suggestions available</p>
        )}
      </div>

      {/* Trending Hashtags Section */}
      <div className="suggestions-section">
        <h3 className="section-title">Trending Now</h3>

        {hashtagsLoading ? (
          <div className="hashtags-loading">
            <div className="skeleton" style={{ height: '36px' }} />
            <div className="skeleton" style={{ height: '36px' }} />
            <div className="skeleton" style={{ height: '36px' }} />
          </div>
        ) : trendingHashtags && trendingHashtags.length > 0 ? (
          <div className="hashtags-list">
            {trendingHashtags.map((hashtag, index) => (
              <motion.div
                key={`${hashtag.hashtag}-${index}`}
                className="hashtag-chip"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <a
                  href={`/p/h/${encodeURIComponent(hashtag.hashtag)}`}
                  className="hashtag-link"
                  onClick={e => {
                    e.preventDefault();
                    handleHashtagClick(hashtag.hashtag);
                  }}
                >
                  <span className="hashtag-text">#{hashtag.hashtag}</span>
                  <span className="hashtag-count">{hashtag.count} posts</span>
                </a>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="no-suggestions">No trending hashtags</p>
        )}
      </div>
    </motion.div>
  );
}
