import React from 'react';
import Link from 'next/link';

interface PostNotFoundProps {
  postId: string;
}

/**
 * PostNotFound component - displays a styled error page when a post is not found
 * @param {string} postId - The post ID that was not found
 */
export const PostNotFound: React.FC<PostNotFoundProps> = ({ postId }) => {
  return (
    <div className="post-not-found">
      <div className="post-not-found__container">
        <div className="post-not-found__content">
          {/* Icon */}
          <div className="post-not-found__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="post-not-found__title">Post Not Found</h1>

          {/* Description */}
          <p className="post-not-found__description">
            Sorry, we couldn't find the post you're looking for. This post may
            have been removed or the link might be incorrect.
          </p>

          {/* Actions */}
          <div className="post-not-found__actions">
            <Link href="/" className="post-not-found__button primary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
