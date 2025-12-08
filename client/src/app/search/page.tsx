'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks';
import '@/styles/components/search.scss';

/**
 * Search page component
 * Route: /search (Protected - requires authentication)
 * Displays a centered search interface with search bar and icon
 * Supports searching for users, posts, and hashtags
 * @returns {JSX.Element} Search page content
 */
export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType] = useState<'all' | 'users' | 'posts' | 'hashtags'>('all');

  // Enable search when query is at least 2 characters
  const { data: searchResults, isLoading } = useSearch(
    searchQuery,
    searchType,
    1,
    20,
    searchQuery.length >= 2
  );

  // Use real API data
  const displayData =
    searchResults && searchQuery.length >= 2 ? searchResults : null;
  const isLoadingData = isLoading;

  const handleSelectResult = (type: string, identifier: string) => {
    // Navigate to appropriate page based on type
    if (type === 'username') {
      // Navigate to user profile
      router.push(`/j/${identifier}`);
    } else if (type === 'post') {
      // Navigate to post detail
      router.push(`/p/${identifier}`);
    } else if (type === 'hashtag') {
      // Navigate to hashtag posts
      router.push(`/h/${identifier}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Show results if query is 2+ characters
  const showResults = searchQuery.trim().length >= 2;

  // If showing results
  if (showResults && searchQuery.trim().length >= 2) {
    return (
      <motion.div
        className="search-container search-results-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="search-results-content"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Search Bar */}
          <div className="search-results-header">
            <form className="search-input-wrapper">
              <motion.input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                whileFocus={{ scale: 1.02 }}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={clearSearch}
                >
                  <X size={20} />
                </button>
              )}
            </form>
            {isLoadingData && <Loader2 className="search-loader" size={20} />}
          </div>

          {/* Search Results */}
          {isLoadingData ? (
            <div className="search-loading">
              <Loader2 className="spinner" size={40} />
              <p>Searching...</p>
            </div>
          ) : displayData ? (
            <div className="search-results">
              {/* Users Results */}
              {displayData.users && displayData.users.length > 0 && (
                <div className="result-section">
                  <h3 className="result-section-title">Users</h3>
                  <div className="result-list">
                    {displayData.users.map((user: any) => (
                      <motion.button
                        key={user._id}
                        className="result-item user-result"
                        onClick={() =>
                          handleSelectResult('username', user.username)
                        }
                        whileHover={{ backgroundColor: 'var(--bg-secondary)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="result-item-content">
                          <p className="result-item-title">@{user.username}</p>
                          {user.firstName && (
                            <p className="result-item-subtitle">
                              {user.firstName} {user.lastName || ''}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts Results */}
              {displayData.posts && displayData.posts.length > 0 && (
                <div className="result-section">
                  <h3 className="result-section-title">Posts</h3>
                  <div className="result-list">
                    {displayData.posts.map((post: any) => (
                      <motion.button
                        key={post._id}
                        className="result-item post-result"
                        onClick={() => handleSelectResult('post', post._id)}
                        whileHover={{ backgroundColor: 'var(--bg-secondary)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="result-item-content">
                          <p className="result-item-title">{post.title}</p>
                          <p className="result-item-subtitle">
                            {post.description?.substring(0, 80)}...
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtags Results */}
              {displayData.hashtags && displayData.hashtags.length > 0 && (
                <div className="result-section">
                  <h3 className="result-section-title">Hashtags</h3>
                  <div className="result-list hashtag-list">
                    {displayData.hashtags.map((hashtag: string) => (
                      <motion.button
                        key={hashtag}
                        className="result-item hashtag-result"
                        onClick={() => handleSelectResult('hashtag', hashtag)}
                        whileHover={{ backgroundColor: 'var(--bg-secondary)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="result-item-content">
                          <p className="result-item-title">#{hashtag}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {(!displayData.users || displayData.users.length === 0) &&
                (!displayData.posts || displayData.posts.length === 0) &&
                (!displayData.hashtags ||
                  displayData.hashtags.length === 0) && (
                  <div className="search-empty">
                    <SearchIcon size={48} />
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
            </div>
          ) : (
            <div className="search-empty">
              <SearchIcon size={48} />
              <p>No results found</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // Initial search view
  return (
    <motion.div
      className="search-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="search-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Big Search Icon */}
        <motion.div className="search-icon-wrapper">
          <SearchIcon size={120} />
        </motion.div>

        {/* Search Input */}
        <form className="search-input-wrapper">
          <motion.input
            type="text"
            placeholder="Search users, posts, hashtags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            autoFocus
          />
          {searchQuery.length >= 2 && (
            <motion.button
              type="button"
              className="search-suggestion-btn"
              disabled
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Searching...
            </motion.button>
          )}
        </form>

        {/* Character Count */}
        {searchQuery.length < 2 && searchQuery.length > 0 && (
          <p className="search-hint">Type at least 2 characters to search</p>
        )}
      </motion.div>
    </motion.div>
  );
}
