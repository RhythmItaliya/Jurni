'use client';

import React from 'react';
import { Button, IconButton, Avatar } from '@/components/ui';
import Input from '@/components/ui/Input';

const dummyComments = [
  {
    id: '1',
    author: 'john_doe',
    text: 'Great post! Love this content.',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    author: 'jane_smith',
    text: 'Thanks for sharing this!',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    author: 'mike_wilson',
    text: 'Awesome work, keep it up! This is really inspiring.',
    timestamp: '30 minutes ago',
  },
  {
    id: '4',
    author: 'sarah_jones',
    text: 'Beautiful shot! What camera did you use?',
    timestamp: '15 minutes ago',
  },
];

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  avatar?: string;
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="comment-item">
      <div className="comment-header">
        {/* Use project's author-avatar style and fallback */}
        <Avatar
          src={comment.avatar}
          alt={comment.author}
          size="sm"
          className="comment-profile-pic"
        />
        <span className="comment-author">@{comment.author}</span>
        <span className="comment-time">{comment.timestamp}</span>
      </div>
      <p className="comment-text">{comment.text}</p>
    </div>
  );
}

export default function CommentsPanel({
  postId,
  onClose,
}: {
  postId: string | null;
  onClose: () => void;
}) {
  const handleClose = () => {
    onClose();
  };

  if (!postId) {
    return null;
  }

  return (
    <div className="comments-panel comments-panel--open">
      {/* Header Section */}
      <div className="comments-panel-header">
        <div className="comments-header-user">
          <Avatar
            src="/assets/img/default-profile.png"
            alt="username"
            size="md"
          />
          <div className="comments-header-meta">
            <span className="comments-header-username">@username</span>
            <span className="comments-header-count">
              {dummyComments.length} comments
            </span>
          </div>
        </div>
        <IconButton
          variant="ghost"
          size="sm"
          className="comments-panel-close"
          aria-label="Close comments"
          onClick={handleClose}
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>

      {/* Middle Section: Scrollable Comments */}
      <div className="comments-panel-middle">
        <div className="comments-list">
          {dummyComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>

      {/* Footer Section: Input and Button */}
      <div className="comments-panel-footer">
        <form className="comment-form">
          <Input
            className="comment-input"
            type="text"
            placeholder="Write a comment..."
            aria-label="Write a comment"
          />
          <Button className="comment-post-btn" variant="outline" size="sm">
            Post
          </Button>
        </form>
      </div>
    </div>
  );
}
