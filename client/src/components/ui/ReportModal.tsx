'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import TextArea from './TextArea';
import Select from './Select';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'post' | 'user';
  reportedId: string;
  reportedName?: string; // postAuthor or username
  isOwn?: boolean; // isOwnPost or isOwnProfile
  onSubmit: (data: {
    reportType: 'post' | 'user';
    reportedId: string;
    reason: string;
    description: string;
  }) => void;
  isSubmitting?: boolean;
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
  reportType,
  reportedId,
  reportedName,
  isOwn = false,
  onSubmit,
  isSubmitting = false,
}: ReportModalProps) {
  const [reason, setReason] = React.useState('spam');
  const [description, setDescription] = React.useState('');

  // Don't show report modal for own content
  if (isOwn) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      reportType,
      reportedId,
      reason,
      description,
    });
    setReason('spam');
    setDescription('');
    onClose();
  };

  const title = reportType === 'post' ? 'Report Post' : 'Report User';
  const infoText =
    reportType === 'post'
      ? `Reporting a post by ${reportedName ? `@${reportedName}` : 'this user'}`
      : `Reporting user ${reportedName ? `@${reportedName}` : ''}`;
  const placeholder =
    reportType === 'post'
      ? "Tell us more about why you're reporting this post..."
      : "Tell us more about why you're reporting this user...";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="medium">
      <form onSubmit={handleSubmit} className="report-form">
        {reportedName && (
          <div className="report-info">
            <p className="info-text">{infoText}</p>
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
            placeholder={placeholder}
            rows={4}
            maxLength={500}
          />
          <p className="character-count">{description.length}/500</p>
        </div>

        <div className="form-actions">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
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
