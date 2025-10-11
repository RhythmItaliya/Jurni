'use client';

import React from 'react';
import { Button, IconButton } from '@/components/ui';

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
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="comment-item">
      <div className="comment-header">
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
      <div className="comments-panel-header">
        <h3 className="comments-panel-title">Comments for Post {postId}</h3>
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

      <div className="comments-panel-body">
        <div className="comments-list">
          {dummyComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        <div className="comment-form">
          <textarea
            className="form-textarea"
            placeholder="Write a comment..."
          />
          <Button variant="primary" size="sm">
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
