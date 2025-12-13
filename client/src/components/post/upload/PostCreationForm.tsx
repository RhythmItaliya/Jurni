import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { Input, TextArea, Select, Checkbox } from '@/components/ui';
import { CreatePostData, PostData } from '@/types/post';
import { useReduxToast } from '@/hooks/useReduxToast';
import {
  getCurrentLocation,
  formatLocation,
  type LocationData,
} from '@/lib/locationUtils';
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
  initialData?: Partial<PostData>;
  isEdit?: boolean;
}

const PostCreationForm: React.FC<PostCreationFormProps> = ({
  onSubmit: _onSubmit,
  loading: _loading,
  error: _error,
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const { showError, showWarning } = useReduxToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step state for multi-step form
  const [currentStep, setCurrentStep] = useState(isEdit ? 1 : 0);
  const totalSteps = isEdit ? 7 : 8; // Edit mode skips media step (0), so 7 steps total

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [currentHashtag, setCurrentHashtag] = useState('');
  const [status, setStatus] = useState<
    'active' | 'deleted' | 'archived' | 'draft'
  >('active');
  const [visibility, setVisibility] = useState<
    'public' | 'private' | 'friends' | 'followers'
  >('public');
  const [allowComments, setAllowComments] = useState(true);
  const [allowLikes, setAllowLikes] = useState(true);
  const [allowShares, setAllowShares] = useState(true);
  const [allowSaves, setAllowSaves] = useState(true);
  const [location, setLocation] = useState<LocationData | undefined>();

  // Initialize form with initial data for editing
  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setHashtags(initialData.hashtags || []);
      setStatus(initialData.status || 'active');
      setVisibility(initialData.visibility || 'public');
      setAllowComments(initialData.allowComments ?? true);
      setAllowLikes(initialData.allowLikes ?? true);
      setAllowShares(initialData.allowShares ?? true);
      setAllowSaves(initialData.allowSaves ?? true);
      setLocation(initialData.location);
    }
  }, [isEdit, initialData]);

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

  // Step navigation handlers
  const handleNext = () => {
    if (currentStep === 0 && selectedFiles.length === 0 && !isEdit) {
      showWarning(
        'Media Required',
        'Please select at least one media file to continue'
      );
      return;
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > (isEdit ? 1 : 0)) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Enter key to go to next step (except on last step and when loading)
  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      // Don't trigger if in preview mode, on last step, or while loading
      if (isPreviewMode || currentStep === totalSteps - 1 || _loading) return;

      // Don't trigger if user is typing in textarea or input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };

    document.addEventListener('keydown', handleEnterKey);

    return () => {
      document.removeEventListener('keydown', handleEnterKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isPreviewMode, selectedFiles.length, _loading]);

  // Hashtag handling
  const addHashtag = () => {
    let trimmedTag = currentHashtag.trim();
    // Remove any leading # if present
    if (trimmedTag.startsWith('#')) {
      trimmedTag = trimmedTag.slice(1);
    }
    // Convert spaces to underscores
    trimmedTag = trimmedTag.replace(/\s+/g, '_');

    if (trimmedTag && !hashtags.includes(trimmedTag) && hashtags.length < 30) {
      setHashtags([...hashtags, trimmedTag]);
      setCurrentHashtag('');
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };

  // Location handling
  const handleGetLocation = () => {
    getCurrentLocation({
      onSuccess: locationData => {
        setLocation(locationData);
      },
      onError: (error, details) => {
        showError(error, details || '');
      },
    });
  };

  const handleSubmit = async () => {
    // Prevent submission if already loading
    if (_loading) {
      return;
    }

    if (!title.trim()) {
      showWarning('Title Required', 'Please enter a title for your post');
      return;
    }
    const postData: CreatePostData = {
      title: title.trim(),
      description: description.trim() || undefined,
      hashtags: hashtags.length > 0 ? hashtags : undefined,
      status,
      visibility,
      allowComments,
      allowLikes,
      allowShares,
      allowSaves,
      location,
    };

    try {
      await _onSubmit(postData, selectedFiles);

      if (!isEdit) {
        // Reset form after successful submission (only for create mode)
        setSelectedFiles([]);
        setPreviews([]);
        setTitle('');
        setDescription('');
        setHashtags([]);
        setCurrentHashtag('');
        setStatus('active');
        setVisibility('public');
        setAllowComments(true);
        setAllowLikes(true);
        setAllowShares(true);
        setAllowSaves(true);
        setLocation(undefined);
        setCurrentStep(0);

        // Redirect to profile page after successful post creation
        router.push('/profile');
      }
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error submitting post:', error);
    }
  };

  return (
    <div className={`post-creation-container ${isEdit ? 'edit-mode' : ''}`}>
      <div
        className="post-creation-card-wrapper"
        style={
          {
            '--progress': `${((currentStep + 1) / totalSteps) * 100}%`,
          } as React.CSSProperties
        }
      >
        <Card className="post-creation-card">
          {/* Step Indicator */}
          <div className="step-indicator">
            <div className="step-info">
              <span className="step-number">
                Step {isEdit ? currentStep : currentStep + 1} of {totalSteps}
              </span>
              <span className="step-title">
                {isEdit ? (
                  <>
                    {currentStep === 1 && 'Post Title'}
                    {currentStep === 2 && 'Description'}
                    {currentStep === 3 && 'Hashtags'}
                    {currentStep === 4 && 'Post Status'}
                    {currentStep === 5 && 'Visibility'}
                    {currentStep === 6 && 'Location'}
                    {currentStep === 7 && 'Permissions'}
                  </>
                ) : (
                  <>
                    {currentStep === 0 && 'Media Selection'}
                    {currentStep === 1 && 'Post Title'}
                    {currentStep === 2 && 'Description'}
                    {currentStep === 3 && 'Hashtags'}
                    {currentStep === 4 && 'Post Status'}
                    {currentStep === 5 && 'Visibility'}
                    {currentStep === 6 && 'Location'}
                    {currentStep === 7 && 'Permissions'}
                  </>
                )}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="media-step"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="step-content media-step"
              >
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
                      selectedFiles.length === 0 &&
                      fileInputRef.current?.click()
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
                              autoPlay
                              loop
                            />
                          )}

                          {/* Navigation Arrows */}
                          {selectedFiles.length > 1 && (
                            <>
                              <motion.div
                                className="nav-arrow nav-arrow-left"
                                whileHover={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                }}
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
                                whileHover={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                }}
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
                                whileHover={{
                                  borderColor: 'var(--primary-color)',
                                }}
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
                                      autoPlay
                                      loop
                                    />
                                    <div className="video-thumb-overlay">
                                      VIDEO
                                    </div>
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
                                  autoPlay
                                  loop
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
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="title-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="step-content field-step"
              >
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  Add a Title
                </motion.h3>
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <Input
                    type="text"
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter an engaging title for your post"
                    maxLength={2200}
                    required
                    className="form-input"
                  />
                </motion.div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="description-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="step-content field-step"
              >
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  Add a Description
                </motion.h3>
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <TextArea
                    id="description"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Tell your story, share your thoughts..."
                    maxLength={5000}
                    className="form-input"
                  />
                </motion.div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="hashtags-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="step-content field-step"
              >
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  Add Hashtags
                </motion.h3>
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <label htmlFor="hashtag-input" className="form-label">
                    Add Hashtag
                  </label>
                  <div className="hashtag-input-group">
                    <Input
                      type="text"
                      id="hashtag-input"
                      value={currentHashtag}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCurrentHashtag(e.target.value)
                      }
                      onKeyPress={handleHashtagKeyPress}
                      placeholder="Enter hashtag (without #)"
                      className="form-input hashtag-input"
                      maxLength={50}
                    />
                    <Button
                      onClick={addHashtag}
                      disabled={
                        !currentHashtag.trim() ||
                        hashtags.includes(currentHashtag.trim()) ||
                        hashtags.length >= 30
                      }
                      className="add-hashtag-btn"
                    >
                      Add
                    </Button>
                  </div>

                  {hashtags.length > 0 && (
                    <div className="hashtags-display">
                      <label className="form-label">Added Hashtags:</label>
                      <div className="hashtags-chips">
                        {hashtags.map((tag, index) => (
                          <div key={index} className="hashtag-chip">
                            <span className="hashtag-text">#{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeHashtag(tag)}
                              className="hashtag-remove"
                              aria-label={`Remove ${tag} hashtag`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="hashtags-count">
                        {hashtags.length}/30 hashtags
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="status-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="step-content field-step"
              >
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  Post Status
                </motion.h3>
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <Select
                    id="status"
                    value={status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setStatus(
                        e.target.value as
                          | 'active'
                          | 'deleted'
                          | 'archived'
                          | 'draft'
                      )
                    }
                    className="form-input"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'draft', label: 'Draft' },
                      { value: 'archived', label: 'Archived' },
                    ]}
                  />
                </motion.div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="visibility-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="step-content field-step"
              >
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  Set Visibility
                </motion.h3>
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <label htmlFor="visibility" className="form-label">
                    Visibility
                  </label>
                  <Select
                    id="visibility"
                    value={visibility}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setVisibility(
                        e.target.value as
                          | 'public'
                          | 'private'
                          | 'friends'
                          | 'followers'
                      )
                    }
                    className="form-input"
                    options={[
                      { value: 'public', label: 'Public' },
                      { value: 'friends', label: 'Friends' },
                      { value: 'followers', label: 'Followers' },
                      { value: 'private', label: 'Private' },
                    ]}
                  />
                </motion.div>
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="location-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="step-content field-step"
              >
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  Add Location
                </motion.h3>
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div className="location-selector">
                    <motion.button
                      type="button"
                      className="location-button"
                      onClick={handleGetLocation}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                          fill="currentColor"
                        />
                      </svg>
                      <p>Tap to add your location</p>
                    </motion.button>
                    {location && (
                      <motion.div
                        className="selected-location"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="location-name">
                          {formatLocation(location)}
                        </span>
                        <button
                          type="button"
                          className="remove-location"
                          onClick={() => setLocation(undefined)}
                        >
                          ×
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {currentStep === 7 && (
              <motion.div
                key="permissions-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="step-content field-step"
              >
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  Set Permissions
                </motion.h3>
                <motion.div
                  className="form-group permissions-group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Checkbox
                    label="Allow Comments"
                    checked={allowComments}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAllowComments(e.target.checked)
                    }
                  />
                  <Checkbox
                    label="Allow Likes"
                    checked={allowLikes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAllowLikes(e.target.checked)
                    }
                  />
                  <Checkbox
                    label="Allow Shares"
                    checked={allowShares}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAllowShares(e.target.checked)
                    }
                  />
                  <Checkbox
                    label="Allow Saves"
                    checked={allowSaves}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAllowSaves(e.target.checked)
                    }
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="step-navigation">
            {currentStep > (isEdit ? 1 : 0) && (
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={_loading}
              >
                Previous
              </Button>
            )}
            {currentStep < totalSteps - 1 && (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={_loading}
              >
                Next
              </Button>
            )}
            {currentStep === totalSteps - 1 && (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={_loading}
                disabled={_loading}
              >
                {isEdit ? 'Update Post' : 'Create Post'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostCreationForm;
