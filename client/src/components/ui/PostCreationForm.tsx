import React, { useState, useRef } from 'react';
import { CreatePostData, PostLocation } from '@/types/post';
import { Button } from './Button';
import Input from './Input';
import { Spinner } from './Spinner';
import './PostCreationForm.scss';

interface PostCreationFormProps {
  onSubmit: (postData: CreatePostData, mediaFiles?: File[]) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const PostCreationForm: React.FC<PostCreationFormProps> = ({
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    description: '',
    visibility: 'public',
    allowComments: true,
    allowLikes: true,
    allowShares: true,
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string>('');
  const [locationInput, setLocationInput] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof CreatePostData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      const isValid = file.type.startsWith('image/') || 
                     file.type.startsWith('video/') || 
                     file.type.startsWith('audio/');
      return isValid && file.size <= 50 * 1024 * 1024; // 50MB limit
    });

    setMediaFiles(prev => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMediaPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      } else {
        // For audio files, show a placeholder
        setMediaPreviews(prev => [...prev, '/audio-placeholder.svg']);
      }
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleHashtagsChange = (value: string) => {
    setHashtags(value);
    const hashtagArray = value
      .split(/[,\s]+/)
      .map(tag => tag.trim().replace('#', ''))
      .filter(tag => tag.length > 0);
    
    setFormData(prev => ({
      ...prev,
      hashtags: hashtagArray,
    }));
  };

  const handleLocationChange = (value: string) => {
    setLocationInput(value);
    if (value.trim()) {
      const location: PostLocation = {
        name: value.trim(),
      };
      setFormData(prev => ({
        ...prev,
        location,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        location: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim() && !formData.description?.trim() && mediaFiles.length === 0) {
      alert('Please add a title, description, or media to create a post.');
      return;
    }

    await onSubmit(formData, mediaFiles.length > 0 ? mediaFiles : undefined);
  };

  const getSupportedFileTypes = () => {
    return 'image/*,video/*,audio/*';
  };

  return (
    <div className="post-creation-form">
      <div className="post-creation-header">
        <h2>✨ Create New Post</h2>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="post-form">
        {/* Title */}
        <div className="form-group">
          <Input
            type="text"
            placeholder="What's the title of your post? (optional)"
            value={formData.title || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
            maxLength={200}
          />
          {formData.title && (
            <small className="char-count">{formData.title.length}/200</small>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <textarea
            className="description-input"
            placeholder="What's on your mind? Share your thoughts..."
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            maxLength={2000}
          />
          {formData.description && (
            <small className="char-count">{formData.description.length}/2000</small>
          )}
        </div>

        {/* Media Upload */}
        <div className="form-group">
          <div className="media-upload-section">
            <button
              type="button"
              className="media-upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              📷 Add Photos, Videos, or Audio
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={getSupportedFileTypes()}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            <small className="upload-info">
              Supports: Images (20MB), Videos (50MB), Audio (20MB)
            </small>
          </div>

          {/* Media Previews */}
          {mediaPreviews.length > 0 && (
            <div className="media-previews">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="media-preview">
                  {mediaFiles[index]?.type.startsWith('image/') && (
                    <img src={preview} alt={`Preview ${index + 1}`} />
                  )}
                  {mediaFiles[index]?.type.startsWith('video/') && (
                    <video src={preview} controls />
                  )}
                  {mediaFiles[index]?.type.startsWith('audio/') && (
                    <div className="audio-preview">
                      🎵 {mediaFiles[index]?.name}
                    </div>
                  )}
                  <button
                    type="button"
                    className="remove-media"
                    onClick={() => removeMedia(index)}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hashtags */}
        <div className="form-group">
          <Input
            type="text"
            placeholder="Add hashtags... (e.g., #travel #food #life)"
            value={hashtags}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHashtagsChange(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <Input
            type="text"
            placeholder="📍 Add location (optional)"
            value={locationInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationChange(e.target.value)}
          />
        </div>

        {/* Visibility */}
        <div className="form-group">
          <label className="form-label">Who can see this?</label>
          <select
            className="visibility-select"
            value={formData.visibility}
            onChange={(e) => handleInputChange('visibility', e.target.value)}
          >
            <option value="public">🌍 Public - Anyone can see</option>
            <option value="friends">👥 Friends - Only friends</option>
            <option value="followers">👥 Followers - Only followers</option>
            <option value="private">🔒 Private - Only you</option>
          </select>
        </div>

        {/* Advanced Settings Toggle */}
        <div className="form-group">
          <button
            type="button"
            className="advanced-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            ⚙️ Advanced Settings {showAdvanced ? '▲' : '▼'}
          </button>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="advanced-settings">
            <div className="settings-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.allowComments}
                  onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                />
                💬 Allow comments
              </label>
            </div>

            <div className="settings-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.allowLikes}
                  onChange={(e) => handleInputChange('allowLikes', e.target.checked)}
                />
                ❤️ Allow likes
              </label>
            </div>

            <div className="settings-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.allowShares}
                  onChange={(e) => handleInputChange('allowShares', e.target.checked)}
                />
                🔄 Allow shares
              </label>
            </div>

            <div className="settings-group">
              <label className="form-label">📅 Schedule post (optional)</label>
              <input
                type="datetime-local"
                className="datetime-input"
                value={formData.scheduledAt || ''}
                onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="form-actions">
          <Button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                Creating Post...
              </>
            ) : (
              '🚀 Share Post'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostCreationForm;