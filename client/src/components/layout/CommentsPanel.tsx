'use client';

import React from 'react';

// Dummy comments data
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
    <div
      className="comment-item"
      style={{
        marginBottom: '0.75rem',
        padding: '0.5rem',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div
        className="comment-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.25rem',
        }}
      >
        <span
          className="comment-author"
          style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333' }}
        >
          @{comment.author}
        </span>
        <span
          className="comment-time"
          style={{ fontSize: '0.75rem', color: '#666' }}
        >
          {comment.timestamp}
        </span>
      </div>
      <p
        className="comment-text"
        style={{
          margin: 0,
          fontSize: '0.9rem',
          lineHeight: '1.4',
          color: '#444',
        }}
      >
        {comment.text}
      </p>
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
    <div
      className="comments-panel comments-panel--open"
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        background: '#ffffff',
        borderLeft: '1px solid #e6e6e6',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="comments-panel-header"
        style={{
          padding: '0.75rem',
          borderBottom: '1px solid #e6e6e6',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '1rem' }}>
          Comments for Post {postId}
        </h3>
        <button
          className="comments-panel-close"
          onClick={handleClose}
          aria-label="Close comments"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px',
          }}
        >
          ✕
        </button>
      </div>
      <div
        className="comments-panel-body"
        style={{
          padding: '0.75rem',
          overflow: 'auto',
          flex: 1,
          boxSizing: 'border-box',
        }}
      >
        <div className="comments-list">
          {dummyComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        <div
          className="comment-form"
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #e6e6e6',
          }}
        >
          <textarea
            placeholder="Write a comment..."
            style={{
              width: '100%',
              minHeight: '50px',
              padding: '0.5rem',
              border: '1px solid #e6e6e6',
              borderRadius: '4px',
              resize: 'none',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
          <button
            style={{
              marginTop: '0.5rem',
              padding: '0.4rem 0.8rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}
// Removed erroneous trailing JSX and fixed return statement
