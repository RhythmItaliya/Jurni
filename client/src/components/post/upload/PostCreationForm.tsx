import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
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
  onSubmit: (postData: any, mediaFiles?: File[]) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const PostCreationForm: React.FC<PostCreationFormProps> = ({
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, [isPreviewMode, selectedFiles.length]);

  return (
    <div className="post-creation-container">
      <Card className="post-creation-card">
        <div className="post-creation-content">
          {/* Left side - Image/Media selection */}
          <div className="media-selection-section">
            <h3>Media Selection</h3>
            <div
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
                        <IconButton
                          variant="sky"
                          size="md"
                          className="nav-arrow nav-arrow-left"
                          onClick={e => {
                            e.stopPropagation();
                            prevPreview(selectedFiles, setCurrentPreviewIndex);
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
                        <IconButton
                          variant="sky"
                          size="md"
                          className="nav-arrow nav-arrow-right"
                          onClick={e => {
                            e.stopPropagation();
                            nextPreview(selectedFiles, setCurrentPreviewIndex);
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
                        <div
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
                        >
                          {file.type.startsWith('image/') ? (
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
                          <IconButton
                            variant="accent"
                            size="xxs"
                            className="remove-thumb-btn"
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="selected-media-grid">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="selected-media-item"
                      onClick={() =>
                        goToPreview(
                          index,
                          setCurrentPreviewIndex,
                          setIsPreviewMode
                        )
                      }
                    >
                      {file.type.startsWith('image/') ? (
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
                      <IconButton
                        variant="accent"
                        size="xxs"
                        className="remove-media-btn"
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
                    </div>
                  ))}
                  <div
                    className="add-media-item"
                    onClick={e => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <span>+ Add More</span>
                  </div>
                </div>
              )}
            </div>
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
              <p>Form fields for post details</p>
              {/* Placeholder for form inputs */}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostCreationForm;
