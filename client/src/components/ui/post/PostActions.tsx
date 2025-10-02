'use client';

import React from 'react';
import { Button } from '../Button';

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
      <Button
        variant={isLiked ? 'primary' : 'ghost'}
        size="sm"
        onClick={onLike}
      >
        ♥ {likeCount ?? 0}
      </Button>
      <Button variant="ghost" size="sm" onClick={onComment}>
        💬 {commentCount ?? 0}
      </Button>
      <Button variant="ghost" size="sm" onClick={onShare}>
        ↗ Share
      </Button>
      <Button variant="ghost" size="sm" onClick={onBookmark}>
        ☆ Save
      </Button>
    </div>
  );
}
