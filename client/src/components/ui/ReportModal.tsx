'use client';

import React from 'react';
import { Modal } from './Modal';
import { useReportPost } from '@/hooks/useReport';
import { Button } from './Button';
import TextArea from './TextArea';
import Select from './Select';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postAuthor?: string;
  isOwnPost?: boolean;
}

const reportReasons = [
  { value: 'spam', label: 'Spam or misleading' },
  { value: 'harassment', label: 'Harassment or hate' },
  { value: 'inappropriate_content', label: 'Inappropriate content' },
  { value: 'copyright_violation', label: 'Copyright violation' },
  { value: 'fake_account', label: 'Fake account' },
  { value: 'other', label: 'Other' },
];

export default function ReportModal({
  isOpen,
  onClose,
  postId,
  postAuthor,
  isOwnPost = false,
}: ReportModalProps) {
  // Don't show report modal for own posts
  if (isOwnPost) {
    return null;
  }
  const [reason, setReason] = React.useState('spam');
  const [description, setDescription] = React.useState('');
  const reportMutation = useReportPost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reportMutation.mutate(
      {
        reportType: 'post',
        reportedId: postId,
        reason: reason as any,
        description,
      },
      {
        onSuccess: () => {
          setReason('spam');
          setDescription('');
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Post" size="medium">
      <form onSubmit={handleSubmit} className="report-form">
        {postAuthor && (
          <div className="report-info">
            <p className="info-text">
              Reporting a post by <strong>@{postAuthor}</strong>
            </p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="reason" className="form-label">
            Reason for Report *
          </label>
          <Select
            id="reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            options={reportReasons}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Additional Details (Optional)
          </label>
          <TextArea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Tell us more about why you're reporting this post..."
            rows={4}
            maxLength={500}
          />
          <p className="character-count">{description.length}/500</p>
        </div>

        <div className="form-actions">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={reportMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={reportMutation.isPending}
            loadingText="Submitting..."
            disabled={!reason}
          >
            Submit Report
          </Button>
        </div>
      </form>
    </Modal>
  );
}
