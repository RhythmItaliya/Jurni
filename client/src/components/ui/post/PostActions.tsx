'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
            <motion.svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isLiked ? 'currentColor' : 'none'}
              xmlns="http://www.w3.org/2000/svg"
              animate={{
                scale: isLiked ? [1, 1.3, 1] : 1,
                rotate: isLiked ? [0, 10, -10, 0] : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <use href="/icons.svg#icon-heart" />
            </motion.svg>
          }
        />
        <motion.span
          className="like-count"
          animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {likeCount ?? 0}
        </motion.span>
      </div>
      <div className="action-group comment-group">
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
              <use href="/icons.svg#icon-comment" />
            </svg>
          }
        />
        <span className="comment-count">{commentCount ?? 0}</span>
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
              <use href="/icons.svg#icon-share" />
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
              <use href="/icons.svg#icon-bookmark" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
