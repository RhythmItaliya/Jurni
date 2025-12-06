import React from 'react';
import Link from 'next/link';

interface PostMessageProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  postId?: string; // Optional for backward compatibility
}

/**
 * PostMessage component - displays a styled message page for various post-related scenarios
 * @param {React.ReactNode} icon - The icon to display
 * @param {string} title - The main heading
 * @param {string} description - The description text
 * @param {string} buttonText - The button text
 * @param {string} buttonHref - The button link
 * @param {string} postId - Optional post ID for backward compatibility
 */
export const PostMessage: React.FC<PostMessageProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonHref,
  postId,
}) => {
  const defaultIcon = (
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
  );

  return (
    <div className="post-not-found">
      <div className="post-not-found__container">
        <div className="post-not-found__content">
          {/* Icon */}
          <div className="post-not-found__icon">{icon || defaultIcon}</div>

          {/* Heading */}
          <h1 className="post-not-found__title">{title}</h1>

          {/* Description */}
          <p className="post-not-found__description">{description}</p>

          {/* Actions */}
          <div className="post-not-found__actions">
            <Link href={buttonHref} className="post-not-found__button primary">
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * PostNotFound component - displays a styled error page when a post is not found
 * @param {string} postId - The post ID that was not found
 */
export const PostNotFound: React.FC<{ postId: string }> = ({ postId }) => {
  return (
    <PostMessage
      title="Post Not Found"
      description="Sorry, we couldn't find the post you're looking for. This post may have been removed or the link might be incorrect."
      buttonText="Go Home"
      buttonHref="/"
    />
  );
};
