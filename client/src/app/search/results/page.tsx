'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchUsers, useSearchPosts, useSearchHashtags } from '@/hooks';
import '@/styles/components/search.scss';
import { Spinner } from '@/components/ui';

/**
 * Search Results Details Page
 * Route: /search/results?type=username|hashtag|post&q=value
 * Displays filtered results based on search type and query
 */
export default function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as
    | 'username'
    | 'hashtag'
    | 'post'
    | null;
  const query = searchParams.get('q') || '';

  // Fetch data for all types (hooks must be called unconditionally)
  const usersResult = useSearchUsers(
    query,
    1,
    50,
    type === 'username' && !!query
  );
  const hashtagsResult = useSearchHashtags(
    query,
    50,
    type === 'hashtag' && !!query
  );
  const postsResult = useSearchPosts(query, 1, 50, type === 'post' && !!query);

  // Select appropriate data based on type
  let data;
  let isLoading;

  if (type === 'username') {
    data = usersResult.data?.users || [];
    isLoading = usersResult.isLoading;
  } else if (type === 'hashtag') {
    data = hashtagsResult.data?.hashtags || [];
    isLoading = hashtagsResult.isLoading;
  } else if (type === 'post') {
    data = postsResult.data?.posts || [];
    isLoading = postsResult.isLoading;
  } else {
    data = [];
    isLoading = false;
  }

  const handleResultClick = (item: unknown) => {
    if (type === 'username') {
      router.push(`/profile/${(item as { username: string }).username}`);
    } else if (type === 'post') {
      router.push(`/p/${(item as { _id: string })._id}`);
    } else if (type === 'hashtag') {
      router.push(
        `/search?type=hashtag&q=${encodeURIComponent(item as string)}`
      );
    }
  };

  return (
    <motion.div
      className="search-container search-results-detail-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="search-results-detail-content"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="results-detail-header">
          <button
            className="search-back-btn"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="results-detail-title">
            {type === 'username'
              ? `Users matching "${query}"`
              : type === 'post'
                ? `Posts matching "${query}"`
                : `Posts with #${query}`}
          </h1>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="results-detail-loading">
            <Spinner size="md" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="results-detail-list">
            {Array.isArray(data) &&
              data.map((item: Record<string, unknown>) => (
                <motion.div
                  key={type === 'hashtag' ? String(item) : String(item._id)}
                  className={`results-detail-item ${type}`}
                  onClick={() => handleResultClick(item)}
                  whileHover={{ backgroundColor: 'var(--bg-secondary)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {type === 'username' && (
                    <div className="detail-item-content">
                      <h3>@{String(item.username)}</h3>
                      {item.firstName ? (
                        <p className="detail-item-subtitle">
                          {String(item.firstName)}{' '}
                          {item.lastName ? String(item.lastName) : ''}
                        </p>
                      ) : null}
                      {item.email ? (
                        <p className="detail-item-meta">{String(item.email)}</p>
                      ) : null}
                    </div>
                  )}
                  {type === 'post' && (
                    <div className="detail-item-content">
                      <h3>{String(item.title)}</h3>
                      {item.description ? (
                        <p className="detail-item-subtitle">
                          {String(item.description)}
                        </p>
                      ) : null}
                      {item.authorId ? (
                        <p className="detail-item-meta">
                          by @
                          {String(
                            (item.authorId as Record<string, unknown>).username
                          )}
                        </p>
                      ) : null}
                    </div>
                  )}
                  {type === 'hashtag' && (
                    <div className="detail-item-content">
                      <h3>#{String(item)}</h3>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="results-detail-empty">
            <AlertCircle size={48} />
            <h2>No results found</h2>
            <p>
              {type === 'username'
                ? `No users found matching "${query}"`
                : type === 'post'
                  ? `No posts found matching "${query}"`
                  : `No posts with #${query}`}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
