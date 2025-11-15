import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { CreatePostData } from '@/types/post';
import PostDetailsForm from './PostDetailsForm';
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
          <PostDetailsForm
            title={title}
            description={description}
            hashtags={hashtags}
            visibility={visibility}
            location={location}
            allowComments={allowComments}
            allowLikes={allowLikes}
            allowShares={allowShares}
            loading={_loading}
            error={_error}
            hasMedia={selectedFiles.length > 0}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onHashtagsChange={setHashtags}
            onVisibilityChange={setVisibility}
            onLocationChange={setLocation}
            onAllowCommentsChange={setAllowComments}
            onAllowLikesChange={setAllowLikes}
            onAllowSharesChange={setAllowShares}
            onSubmit={() => {
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
          />
        </div>
      </Card>
    </div>
  );
};

export default PostCreationForm;
