import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { CreatePostData } from '@/types/post';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

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
  // Keep form minimal for upload testing: title, description and media
  // hashtags removed for focused upload testing

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof CreatePostData,
    value: string | boolean | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Define per-type limits
    const MAX_IMAGE = 20 * 1024 * 1024; // 20MB
    const MAX_VIDEO = 50 * 1024 * 1024; // 50MB
    const MAX_AUDIO = 20 * 1024 * 1024; // 20MB

    const validFiles: File[] = [];

    newFiles.forEach(file => {
      const type = file.type;
      if (type.startsWith('image/')) {
        if (file.size <= MAX_IMAGE) validFiles.push(file);
      } else if (type.startsWith('video/')) {
        if (file.size <= MAX_VIDEO) validFiles.push(file);
      } else if (type.startsWith('audio/')) {
        if (file.size <= MAX_AUDIO) validFiles.push(file);
      }
    });

    if (validFiles.length === 0) return;

    setMediaFiles(prev => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = e => {
          const result = (e.target && (e.target as FileReader).result) || null;
          if (typeof result === 'string') {
            setMediaPreviews(prev => [...prev, result]);
          }
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

  // Hashtags/location/advanced settings are removed for focused upload testing.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title?.trim() &&
      !formData.description?.trim() &&
      mediaFiles.length === 0
    ) {
      alert('Please add a title, description, or media to create a post.');
      return;
    }

    // Ensure title is always provided (server requires it)
    const postDataWithTitle = {
      ...formData,
      title:
        formData.title?.trim() || formData.description?.trim() || 'New Post',
    };

    // Only include media files if present
    await onSubmit(
      postDataWithTitle,
      mediaFiles.length > 0 ? mediaFiles : undefined
    );
  };

  const getSupportedFileTypes = () => {
    return 'image/*,video/*,audio/*';
  };

  // Max files allowed per post (not enforced in focused upload testing)

  return (
    <div className="post-creation-form">
      <div className="post-creation-header">
        <h2>✨ Create New Post</h2>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        {/* Title */}
        <div className="form-group">
          <Input
            type="text"
            placeholder="What's the title of your post? (optional)"
            value={formData.title || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange('title', e.target.value)
            }
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
            onChange={e => handleInputChange('description', e.target.value)}
            rows={4}
            maxLength={2000}
          />
          {formData.description && (
            <small className="char-count">
              {formData.description.length}/2000
            </small>
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
              Supports: Images (≤20MB), Videos (≤50MB), Audio (≤20MB)
            </small>
          </div>

          {/* Media Previews */}
          {mediaPreviews.length > 0 && (
            <div className="media-previews">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="media-preview">
                  {mediaFiles[index]?.type.startsWith('image/') && (
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
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

        {/* NOTE: Simplified form - only title, description and media upload are kept for testing */}
        {/* We removed hashtags, location, visibility and advanced settings to focus on media upload testing */}

        {/* Submit Button */}
        <div className="form-actions">
          <Button type="submit" disabled={loading} className="submit-btn">
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
