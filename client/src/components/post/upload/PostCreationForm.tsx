import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Input, TextArea, Select, Checkbox, Button } from '@/components/ui';
import { CreatePostData } from '@/types/post';
import {
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileSelect,
  removeFile,
  nextPreview,
  prevPreview,
  goToPreview,
  exitPreview,
} from '../utils/mediaHandlers';

interface PostCreationFormProps {
  onSubmit: (postData: CreatePostData, mediaFiles?: File[]) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const PostCreationForm: React.FC<PostCreationFormProps> = ({
  onSubmit: _onSubmit,
  loading: _loading,
  error: _error,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<
    'public' | 'private' | 'friends' | 'followers'
  >('public');
  const [allowComments, setAllowComments] = useState(true);
  const [allowLikes, setAllowLikes] = useState(true);
  const [allowShares, setAllowShares] = useState(true);
  const [location, setLocation] = useState<
    | { name: string; latitude?: number; longitude?: number; address?: string }
    | undefined
  >();

  // Keyboard navigation for preview mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPreviewMode || selectedFiles.length <= 1) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPreview(selectedFiles, setCurrentPreviewIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextPreview(selectedFiles, setCurrentPreviewIndex);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        exitPreview(setIsPreviewMode);
      }
    };

    if (isPreviewMode) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPreviewMode, selectedFiles]);

  return (
    <div className="post-creation-container">
      <Card className="post-creation-card">
        <div className="post-creation-content">
          {/* Left side - Image/Media selection */}
          <div className="media-selection-section">
            <h3>Media Selection</h3>
            <motion.div
              className={`media-upload-area ${isDragOver ? 'drag-over' : ''} ${selectedFiles.length > 0 ? 'has-media' : ''}`}
              onDragOver={e => handleDragOver(e, setIsDragOver)}
              onDragLeave={e => handleDragLeave(e, setIsDragOver)}
              onDrop={e =>
                handleDrop(
                  e,
                  selectedFiles,
                  setSelectedFiles,
                  setPreviews,
                  setIsDragOver
                )
              }
              onClick={() =>
                selectedFiles.length === 0 && fileInputRef.current?.click()
              }
              whileHover={
                selectedFiles.length === 0
                  ? {
                      borderColor: 'var(--primary-color)',
                      backgroundColor: 'var(--bg-hover)',
                    }
                  : {}
              }
              animate={{
                borderColor: isDragOver
                  ? 'var(--primary-color)'
                  : 'var(--border-color)',
                backgroundColor: isDragOver
                  ? 'var(--primary-light)'
                  : 'var(--bg-surface)',
              }}
            >
              {selectedFiles.length === 0 ? (
                <div className="upload-placeholder">
                  <p>Click to select or drag and drop images/videos</p>
                  <p>Supported: JPG, PNG, GIF, MP4, MOV</p>
                </div>
              ) : isPreviewMode ? (
                <div className="media-preview-container">
                  {/* Main Preview */}
                  <div className="main-preview">
                    {selectedFiles[currentPreviewIndex]?.type.startsWith(
                      'image/'
                    ) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previews[currentPreviewIndex]}
                        alt={selectedFiles[currentPreviewIndex].name}
                        className="preview-media"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(
                          selectedFiles[currentPreviewIndex]
                        )}
                        className="preview-media"
                        controls
                        muted
                      />
                    )}

                    {/* Navigation Arrows */}
                    {selectedFiles.length > 1 && (
                      <>
                        <motion.div
                          className="nav-arrow nav-arrow-left"
                          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                        >
                          <IconButton
                            variant="sky"
                            size="md"
                            onClick={e => {
                              e.stopPropagation();
                              prevPreview(
                                selectedFiles,
                                setCurrentPreviewIndex
                              );
                            }}
                            icon={
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <use href="/icons.svg#icon-chevron-left" />
                              </svg>
                            }
                          />
                        </motion.div>
                        <motion.div
                          className="nav-arrow nav-arrow-right"
                          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                        >
                          <IconButton
                            variant="sky"
                            size="md"
                            onClick={e => {
                              e.stopPropagation();
                              nextPreview(
                                selectedFiles,
                                setCurrentPreviewIndex
                              );
                            }}
                            icon={
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <use href="/icons.svg#icon-chevron-right" />
                              </svg>
                            }
                          />
                        </motion.div>
                      </>
                    )}

                    {/* Close Preview Button */}
                    <IconButton
                      variant="accent"
                      size="sm"
                      className="close-preview-btn"
                      onClick={e => {
                        e.stopPropagation();
                        exitPreview(setIsPreviewMode);
                      }}
                      icon={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <use href="/icons.svg#icon-close" />
                        </svg>
                      }
                    />
                  </div>

                  {/* Thumbnail Strip */}
                  {selectedFiles.length > 1 && (
                    <div className="thumbnail-strip">
                      {selectedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          className={`thumbnail-item ${index === currentPreviewIndex ? 'active' : ''}`}
                          onClick={e => {
                            e.stopPropagation();
                            goToPreview(
                              index,
                              setCurrentPreviewIndex,
                              setIsPreviewMode
                            );
                          }}
                          whileHover={{ borderColor: 'var(--primary-color)' }}
                        >
                          {file.type.startsWith('image/') ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={previews[index]}
                              alt={file.name}
                              className="thumbnail-media"
                            />
                          ) : (
                            <div className="thumbnail-video">
                              <video
                                src={URL.createObjectURL(file)}
                                className="thumbnail-media"
                                muted
                              />
                              <div className="video-thumb-overlay">VIDEO</div>
                            </div>
                          )}
                          <motion.div
                            className="remove-thumb-btn"
                            animate={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          >
                            <IconButton
                              variant="accent"
                              size="xxs"
                              onClick={e => {
                                e.stopPropagation();
                                removeFile(
                                  index,
                                  selectedFiles,
                                  setSelectedFiles,
                                  previews,
                                  setPreviews,
                                  currentPreviewIndex,
                                  setCurrentPreviewIndex,
                                  setIsPreviewMode
                                );
                              }}
                              icon={
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <use href="/icons.svg#icon-close" />
                                </svg>
                              }
                            />
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="selected-media-grid">
                  {selectedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      className="selected-media-item"
                      onClick={() =>
                        goToPreview(
                          index,
                          setCurrentPreviewIndex,
                          setIsPreviewMode
                        )
                      }
                      whileHover={{
                        borderColor: 'var(--primary-color)',
                        scale: 1.02,
                      }}
                    >
                      {file.type.startsWith('image/') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previews[index]}
                          alt={file.name}
                          className="selected-media-image"
                        />
                      ) : (
                        <div className="selected-media-video">
                          <video
                            src={URL.createObjectURL(file)}
                            className="selected-media-video-thumb"
                            muted
                          />
                          <div className="video-indicator">VIDEO</div>
                        </div>
                      )}
                      <div className="media-info">
                        <span className="media-name">{file.name}</span>
                        <span className="media-size">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <motion.div
                        className="remove-media-btn"
                        animate={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <IconButton
                          variant="accent"
                          size="xxs"
                          onClick={e => {
                            e.stopPropagation();
                            removeFile(
                              index,
                              selectedFiles,
                              setSelectedFiles,
                              previews,
                              setPreviews,
                              currentPreviewIndex,
                              setCurrentPreviewIndex,
                              setIsPreviewMode
                            );
                          }}
                          icon={
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="/icons.svg#icon-close" />
                            </svg>
                          }
                        />
                      </motion.div>
                    </motion.div>
                  ))}
                  <motion.div
                    className="add-media-item"
                    onClick={e => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    whileHover={{
                      borderColor: 'var(--primary-color)',
                      backgroundColor: 'var(--bg-hover)',
                      color: 'var(--primary-color)',
                      scale: 1.02,
                    }}
                  >
                    <span>+ Add More</span>
                  </motion.div>
                </div>
              )}
            </motion.div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={e =>
                handleFileSelect(
                  e,
                  selectedFiles,
                  setSelectedFiles,
                  setPreviews
                )
              }
              style={{ display: 'none' }}
            />
          </div>

          {/* Right side - Post details */}
          <div className="post-details-section">
            <h3>Post Details</h3>
            <div className="post-form">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  maxLength={2200}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <TextArea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tell your story..."
                  maxLength={5000}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="hashtags">Hashtags</label>
                <Input
                  type="text"
                  id="hashtags"
                  value={hashtags.join(' ')}
                  onChange={e =>
                    setHashtags(
                      e.target.value.split(' ').filter(tag => tag.trim() !== '')
                    )
                  }
                  placeholder="#travel #adventure"
                />
                <small>Separate with spaces, max 30 tags</small>
              </div>

              <div className="form-group">
                <label htmlFor="visibility">Visibility</label>
                <Select
                  id="visibility"
                  value={visibility}
                  onChange={e =>
                    setVisibility(e.target.value as typeof visibility)
                  }
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="followers">Followers</option>
                  <option value="private">Private</option>
                </Select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <Input
                  type="text"
                  id="location"
                  value={location?.name || ''}
                  onChange={e =>
                    setLocation(
                      e.target.value ? { name: e.target.value } : undefined
                    )
                  }
                  placeholder="Add location"
                />
              </div>

              <div className="form-group checkboxes">
                <Checkbox
                  checked={allowComments}
                  onChange={e => setAllowComments(e.target.checked)}
                  label="Allow Comments"
                />
                <Checkbox
                  checked={allowLikes}
                  onChange={e => setAllowLikes(e.target.checked)}
                  label="Allow Likes"
                />
                <Checkbox
                  checked={allowShares}
                  onChange={e => setAllowShares(e.target.checked)}
                  label="Allow Shares"
                />
              </div>

              <Button
                onClick={() => {
                  if (!title.trim()) {
                    alert('Title is required');
                    return;
                  }
                  const postData: CreatePostData = {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    hashtags: hashtags.length > 0 ? hashtags : undefined,
                    visibility,
                    allowComments,
                    allowLikes,
                    allowShares,
                    location,
                  };
                  _onSubmit(postData, selectedFiles);
                }}
                disabled={_loading}
                className="submit-btn"
              >
                {_loading ? 'Creating Post...' : 'Create Post'}
              </Button>

              {_error && <div className="error-message">{_error}</div>}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostCreationForm;
