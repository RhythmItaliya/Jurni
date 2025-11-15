import React from 'react';
import { Input, TextArea, Select, Checkbox, Button } from '@/components/ui';
import { Eye, Users, UserCheck, Lock } from 'lucide-react';

interface PostDetailsFormProps {
  title: string;
  description: string;
  hashtags: string[];
  visibility: 'public' | 'private' | 'friends' | 'followers';
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  allowComments: boolean;
  allowLikes: boolean;
  allowShares: boolean;
  loading?: boolean;
  error?: string | null;
  hasMedia: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onHashtagsChange: (value: string[]) => void;
  onVisibilityChange: (
    value: 'public' | 'private' | 'friends' | 'followers'
  ) => void;
  onLocationChange: (value: { name: string } | undefined) => void;
  onAllowCommentsChange: (value: boolean) => void;
  onAllowLikesChange: (value: boolean) => void;
  onAllowSharesChange: (value: boolean) => void;
  onSubmit: () => void;
}

const PostDetailsForm: React.FC<PostDetailsFormProps> = ({
  title,
  description,
  hashtags,
  visibility,
  location,
  allowComments,
  allowLikes,
  allowShares,
  loading,
  error,
  hasMedia,
  onTitleChange,
  onDescriptionChange,
  onHashtagsChange,
  onVisibilityChange,
  onLocationChange,
  onAllowCommentsChange,
  onAllowLikesChange,
  onAllowSharesChange,
  onSubmit,
}) => {
  const VisibilityIcon = React.useMemo(() => {
    switch (visibility) {
      case 'public':
        return Eye;
      case 'friends':
        return Users;
      case 'followers':
        return UserCheck;
      case 'private':
        return Lock;
      default:
        return Eye;
    }
  }, [visibility]);
  return (
    <div className="post-details-section">
      <h3>Post Details</h3>
      <div className="post-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            placeholder="Enter an engaging title for your post"
            maxLength={2200}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <TextArea
            id="description"
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            placeholder="Tell your story, share your thoughts..."
            maxLength={5000}
            rows={5}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="hashtags" className="form-label">
            Hashtags
          </label>
          <div className="hashtag-input-wrapper">
            <Input
              type="text"
              id="hashtags"
              placeholder="Add hashtag (without #)"
              className="form-input hashtag-input"
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.currentTarget;
                  const value = input.value.trim();
                  if (value && hashtags.length < 30) {
                    onHashtagsChange([...hashtags, value]);
                    input.value = '';
                  }
                }
              }}
            />
            <Button
              onClick={() => {
                const input = document.getElementById(
                  'hashtags'
                ) as HTMLInputElement;
                const value = input?.value.trim();
                if (value && hashtags.length < 30) {
                  onHashtagsChange([...hashtags, value]);
                  input.value = '';
                }
              }}
              className="add-hashtag-btn"
              disabled={hashtags.length >= 30}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7H9V1C9 0.4 8.6 0 8 0Z" />
              </svg>
              Add
            </Button>
          </div>

          {hashtags.length > 0 && (
            <div className="hashtag-preview">
              {hashtags.map((tag, index) => (
                <div key={index} className="hashtag-chip">
                  <span className="hashtag-text">#{tag}</span>
                  <button
                    type="button"
                    className="hashtag-remove"
                    onClick={() => {
                      const newHashtags = hashtags.filter(
                        (_, i) => i !== index
                      );
                      onHashtagsChange(newHashtags);
                    }}
                    aria-label={`Remove ${tag}`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                    >
                      <path d="M7.4 6L11.7 1.7C12.1 1.3 12.1 0.7 11.7 0.3C11.3-0.1 10.7-0.1 10.3 0.3L6 4.6L1.7 0.3C1.3-0.1 0.7-0.1 0.3 0.3C-0.1 0.7-0.1 1.3 0.3 1.7L4.6 6L0.3 10.3C-0.1 10.7-0.1 11.3 0.3 11.7C0.5 11.9 0.7 12 1 12C1.3 12 1.5 11.9 1.7 11.7L6 7.4L10.3 11.7C10.5 11.9 10.7 12 11 12C11.3 12 11.5 11.9 11.7 11.7C12.1 11.3 12.1 10.7 11.7 10.3L7.4 6Z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <small className="form-hint">
            {hashtags.length}/30 tags • Press Enter or click Add button
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="visibility" className="form-label">
            Visibility
          </label>
          <div className="select-with-icon">
            <span className="leading-icon" aria-hidden="true">
              {React.createElement(VisibilityIcon, { size: 16 })}
            </span>
            <Select
              id="visibility"
              value={visibility}
              onChange={e =>
                onVisibilityChange(
                  e.target.value as
                    | 'public'
                    | 'private'
                    | 'friends'
                    | 'followers'
                )
              }
              className="form-select"
            >
              <option value="public">Public</option>
              <option value="friends">Friends</option>
              <option value="followers">Followers</option>
              <option value="private">Private</option>
            </Select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <Input
            type="text"
            id="location"
            value={location?.name || ''}
            onChange={e =>
              onLocationChange(
                e.target.value ? { name: e.target.value } : undefined
              )
            }
            placeholder="Add a location"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Interaction</label>
          <div className="checkbox-group">
            <Checkbox
              checked={allowComments}
              onChange={e => onAllowCommentsChange(e.target.checked)}
              label="Allow Comments"
            />
            <Checkbox
              checked={allowLikes}
              onChange={e => onAllowLikesChange(e.target.checked)}
              label="Allow Likes"
            />
            <Checkbox
              checked={allowShares}
              onChange={e => onAllowSharesChange(e.target.checked)}
              label="Allow Shares"
            />
          </div>
        </div>

        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            <span>{error}</span>
          </div>
        )}

        <Button
          onClick={onSubmit}
          disabled={loading || !title.trim() || !hasMedia}
          className="submit-btn"
        >
          {loading ? 'Creating Post…' : 'Create Post'}
        </Button>
      </div>
    </div>
  );
};

export default PostDetailsForm;
