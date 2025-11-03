'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, IconButton, Avatar, Spinner } from '@/components/ui';
import Input from '@/components/ui/Input';
import { useGetComments, useCreateComment } from '@/hooks/useComments';
import { CommentData } from '@/types/comment';
import { PostData } from '@/types/post';

function CommentItem({
  comment,
  index,
}: {
  comment: CommentData;
  index: number;
}) {
  // Format timestamp to relative time
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className="comment-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="comment-header">
        <Avatar
          src={comment.userId?.avatarUrl || undefined}
          alt={comment.userId?.username || 'User'}
          size="sm"
          className="comment-profile-pic"
        />
        <span className="comment-author">
          @{comment.userId?.username || 'Unknown'}
        </span>
        <span className="comment-time">
          {formatTimestamp(comment.createdAt)}
        </span>
      </div>
      <p className="comment-text">{comment.content}</p>
    </motion.div>
  );
}

export default function CommentsPanel({
  post,
  onClose,
}: {
  post: PostData | null;
  onClose: () => void;
}) {
  const [commentText, setCommentText] = React.useState('');

  // Fetch comments for this post
  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
  } = useGetComments(post?._id || '');

  // Create comment mutation
  const createCommentMutation = useCreateComment(post?._id || '');

  const handleClose = () => {
    onClose();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;

    createCommentMutation.mutate(
      { content: commentText.trim() },
      {
        onSuccess: () => {
          setCommentText('');
        },
      }
    );
  };

  if (!post) {
    return null;
  }

  const comments = commentsData?.comments || [];
  const isLoading = commentsLoading || createCommentMutation.isPending;

  return (
    <div className="comments-panel comments-panel--open">
      {/* Header Section */}
      <div className="comments-panel-header">
        <div className="comments-header-user">
          <Avatar
            src={post.userId.avatarUrl || undefined}
            alt={post.userId.username}
            size="md"
          />
          <div className="comments-header-meta">
            <span className="comments-header-username">
              @{post.userId.username}
            </span>
            <span className="comments-header-count">
              {comments.length} comments
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
        {commentsError ? (
          <div className="comments-error">
            <p>Failed to load comments. Please try again.</p>
          </div>
        ) : commentsLoading ? (
          <div className="comments-loading">
            <Spinner size="md" />
          </div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment, index) => (
              <CommentItem key={comment._id} comment={comment} index={index} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Section: Input and Button */}
      <div className="comments-panel-footer">
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <Input
            className="comment-input"
            type="text"
            placeholder="Write a comment..."
            aria-label="Write a comment"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            disabled={isLoading}
          />
          <Button
            className="comment-post-btn"
            variant="outline"
            size="sm"
            type="submit"
            disabled={isLoading || !commentText.trim()}
          >
            {createCommentMutation.isPending ? 'Posting...' : 'Post'}
          </Button>
        </form>
      </div>
    </div>
  );
}
