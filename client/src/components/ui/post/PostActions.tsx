'use client';

import React from 'react';
import { IconButton } from '../IconButton';

export type PostActionsProps = {
  isLiked?: boolean;
  likeCount?: number;
  commentCount?: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
};

export default function PostActions({
  isLiked,
  likeCount,
  commentCount,
  onLike,
  onComment,
  onShare,
  onBookmark,
}: PostActionsProps) {
  return (
    <div className="post-actions">
      <div className="action-group like-group">
        <IconButton
          variant={isLiked ? 'primary' : 'ghost'}
          size="md"
          className="like-button"
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
          onClick={onLike}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isLiked ? 'currentColor' : 'none'}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <span className="like-count">{likeCount ?? 0}</span>
      </div>
      <div className="action-group">
        <IconButton
          variant="ghost"
          size="md"
          className="comment-button"
          aria-label="Open comments"
          onClick={onComment}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>
      <div className="action-group">
        <IconButton
          variant="ghost"
          size="md"
          className="share-button"
          aria-label="Share post"
          onClick={onShare}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="16,6 12,2 8,6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="2"
                x2="12"
                y2="15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>
      <div className="action-group">
        <IconButton
          variant="ghost"
          size="md"
          className="bookmark-button"
          aria-label="Save post"
          onClick={onBookmark}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}
