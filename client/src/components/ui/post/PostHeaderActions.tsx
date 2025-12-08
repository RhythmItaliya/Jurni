'use client';

import React from 'react';
import { MoreVertical, Flag, Share2, Link2, Trash2 } from 'lucide-react';
import { IconButton } from '../IconButton';
import { Modal } from '../Modal';

interface PostHeaderActionsProps {
  isOwnPost?: boolean;
  onReport?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export default function PostHeaderActions({
  isOwnPost,
  onReport,
  onDelete,
  onShare,
}: PostHeaderActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    setIsMenuOpen(false);
  };

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        className="post-header-menu-btn"
        aria-label="More actions"
        onClick={() => setIsMenuOpen(true)}
        icon={<MoreVertical size={18} />}
      />

      <Modal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title="Post Actions"
        size="small"
      >
        <div className="post-header-actions-menu">
          <button
            className="action-menu-item"
            onClick={() => {
              handleCopyLink();
            }}
          >
            <Link2 size={16} />
            <span>Copy Link</span>
          </button>

          <button
            className="action-menu-item"
            onClick={() => {
              onShare?.();
              setIsMenuOpen(false);
            }}
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>

          {!isOwnPost && (
            <button
              className="action-menu-item danger"
              onClick={() => {
                onReport?.();
                setIsMenuOpen(false);
              }}
            >
              <Flag size={16} />
              <span>Report Post</span>
            </button>
          )}

          {isOwnPost && (
            <button
              className="action-menu-item danger"
              onClick={() => {
                onDelete?.();
                setIsMenuOpen(false);
              }}
            >
              <Trash2 size={16} />
              <span>Delete Post</span>
            </button>
          )}
        </div>
      </Modal>
    </>
  );
}
