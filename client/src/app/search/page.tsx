'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks';
import '@/styles/components/search.scss';

interface SearchUser {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface SearchPost {
  _id: string;
  title: string;
  description?: string;
}

interface SearchLocation {
  place_id: number;
  display_name: string;
  address?: {
    city?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

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
  const [searchType] = useState<
    'all' | 'users' | 'posts' | 'hashtags' | 'locations'
  >('all');

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

  const handleSelectResult = (
    type: string,
    identifier: string,
    locationData?: SearchLocation
  ) => {
    // Navigate to appropriate page based on type
    if (type === 'username') {
      // Navigate to user profile
      router.push(`/j/${identifier}`);
    } else if (type === 'post') {
      // Navigate to post detail
      router.push(`/p/${identifier}`);
    } else if (type === 'hashtag') {
      // Navigate to hashtag posts
      router.push(`/p/h/${encodeURIComponent(identifier)}`);
    } else if (type === 'location' && locationData) {
      // Navigate to location posts
      router.push(`/p/l/${encodeURIComponent(JSON.stringify(locationData))}`);
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
            </div>
          ) : displayData ? (
            <div className="search-results">
              {/* Users Results */}
              {displayData.users && displayData.users.length > 0 && (
                <div className="result-section">
                  <h3 className="result-section-title">Users</h3>
                  <div className="result-list">
                    {displayData.users.map((user: SearchUser) => (
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
                    {displayData.posts.map((post: SearchPost) => (
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

              {/* Locations Results */}
              {displayData.locations && displayData.locations.length > 0 && (
                <div className="result-section">
                  <h3 className="result-section-title">Locations</h3>
                  <div className="result-list">
                    {displayData.locations.map((location: SearchLocation) => (
                      <motion.button
                        key={location.place_id}
                        className="result-item location-result"
                        onClick={() =>
                          handleSelectResult(
                            'location',
                            location.display_name,
                            location
                          )
                        }
                        whileHover={{ backgroundColor: 'var(--bg-secondary)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="result-item-content">
                          <p className="result-item-title">
                            {location.display_name}
                          </p>
                          {location.address && (
                            <p className="result-item-subtitle">
                              {[
                                location.address.city,
                                location.address.county,
                                location.address.state,
                                location.address.country,
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {(!displayData.users || displayData.users.length === 0) &&
                (!displayData.posts || displayData.posts.length === 0) &&
                (!displayData.hashtags || displayData.hashtags.length === 0) &&
                (!displayData.locations ||
                  displayData.locations.length === 0) && (
                  <div className="search-empty">
                    <SearchIcon size={48} />
                    <p>No results found for &quot;{searchQuery}&quot;</p>
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
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search Title */}
        <h1 className="search-title">Search</h1>
        <p className="search-subtitle">
          Find users, posts, hashtags, and locations
        </p>

        {/* Search Input */}
        <form className="search-input-wrapper search-main">
          <motion.input
            type="text"
            placeholder="Enter your search..."
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
