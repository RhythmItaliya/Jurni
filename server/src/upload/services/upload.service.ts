import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import {
  R2StorageService,
  UploadResult,
  UploadOptions,
} from './r2-storage.service';
import { MediaService } from '../../media/services/media.service';
import { MediaType } from '../../media/models/media.model';

export interface MediaUploadResult extends UploadResult {
  mediaType: 'image' | 'video' | 'audio' | 'other';
  isProcessed: boolean;
  thumbnailUrl?: string;
  mediaId?: string;
}

export interface BulkUploadResult {
  successful: MediaUploadResult[];
  failed: Array<{ filename: string; error: string }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  // Supported file types
  private readonly supportedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];

  private readonly supportedVideoTypes = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm',
    'video/avi',
    'video/x-msvideo',
  ];

  private readonly supportedAudioTypes = [
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/aac',
    'audio/flac',
    'audio/m4a',
  ];

  // File size limits (in bytes) - Updated as requested
  private readonly maxImageSize = 20 * 1024 * 1024; // 20MB
  private readonly maxVideoSize = 50 * 1024 * 1024; // 50MB
  private readonly maxAudioSize = 20 * 1024 * 1024; // 20MB

  constructor(
    private readonly r2StorageService: R2StorageService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Upload single media file (image, video, or audio)
   */
  async uploadMedia(
    file: Express.Multer.File,
    userId: string,
    folder: string = 'media',
    postId?: string,
  ): Promise<MediaUploadResult> {
    this.validateFile(file);

    const mediaType = this.getMediaType(file.mimetype);
    const dynamicFolder = `${folder}/${mediaType}`;

    const uploadOptions: UploadOptions = {
      folder: dynamicFolder,
      fileName: this.sanitizeFilename(file.originalname),
      contentType: file.mimetype,
      userId,
    };

    // First upload to R2 - if this fails, nothing gets saved
    const result = await this.r2StorageService.uploadFile(
      file.buffer,
      uploadOptions,
    );

    // Only persist media record if R2 upload succeeded
    let mediaDoc;
    try {
      mediaDoc = await this.mediaService.create({
        userId,
        postId: postId,
        key: result.key,
        url: result.url,
        publicUrl: result.publicUrl,
        bucket: result.bucket,
        mediaType: mediaType as any,
        thumbnailUrl: result.publicUrl, // placeholder
        size: result.size,
        contentType: result.contentType,
        originalName: file.originalname,
      } as any);
    } catch (e) {
      this.logger.error(
        'Failed to persist media record after successful R2 upload:',
        e?.message || e,
      );
      // Clean up R2 file since we couldn't save the record
      try {
        await this.r2StorageService.deleteFile(result.key);
        this.logger.log(
          `Cleaned up R2 file ${result.key} due to database save failure`,
        );
      } catch (cleanupError) {
        this.logger.error(
          `Failed to cleanup R2 file ${result.key}:`,
          cleanupError?.message || cleanupError,
        );
      }
      throw new Error(
        `Upload succeeded but failed to save media record: ${e?.message || e}`,
      );
    }

    return {
      ...result,
      mediaType,
      isProcessed: true,
      mediaId: (mediaDoc as any)._id.toString(),
    };
  }

  /**
   * Upload multiple files with bulk processing
   */
  async uploadMultipleMedia(
    files: Express.Multer.File[],
    userId: string,
    folder: string = 'media',
    postId?: string,
  ): Promise<BulkUploadResult> {
    const results: BulkUploadResult = {
      successful: [],
      failed: [],
      summary: {
        total: files.length,
        successful: 0,
        failed: 0,
      },
    };

    for (const file of files) {
      try {
        const uploadResult = await this.uploadMedia(
          file,
          userId,
          folder,
          postId,
        );
        results.successful.push(uploadResult);
        results.summary.successful++;
      } catch (error: any) {
        results.failed.push({
          filename: file.originalname,
          error: error?.message || String(error),
        });
        results.summary.failed++;
        this.logger.warn(
          `Failed to upload ${file.originalname}: ${error?.message || error}`,
        );
      }
    }

    return results;
  }

  /**
   * Upload user profile image
   */
  async uploadProfileImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<MediaUploadResult> {
    if (!this.supportedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only image files are allowed for profile pictures',
      );
    }

    return this.uploadMedia(file, userId, 'profiles');
  }

  /**
   * Upload post media (images/videos/audio for posts)
   */
  async uploadPostMedia(
    files: Express.Multer.File[],
    userId: string,
    postId?: string,
  ): Promise<BulkUploadResult> {
    const folder = postId ? `posts/${postId}` : 'posts/temp';
    return this.uploadMultipleMedia(files, userId, folder, postId);
  }

  /**
   * Upload audio files
   */
  async uploadAudio(
    file: Express.Multer.File,
    userId: string,
    folder: string = 'audio',
  ): Promise<MediaUploadResult> {
    if (!this.supportedAudioTypes.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported audio type');
    }

    const mediaType = 'audio';
    const uploadOptions: UploadOptions = {
      folder: `${folder}/${mediaType}`,
      fileName: this.sanitizeFilename(file.originalname),
      contentType: file.mimetype,
      userId,
    };

    const result = await this.r2StorageService.uploadFile(
      file.buffer,
      uploadOptions,
    );

    return {
      ...result,
      mediaType,
      isProcessed: true,
    };
  }

  /**
   * Generate presigned URL for direct client uploads
   */
  async generateUploadUrl(
    userId: string,
    filename: string,
    contentType: string,
    folder: string = 'uploads',
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const mediaType = this.getMediaType(contentType);
    const sanitizedFilename = this.sanitizeFilename(filename);

    // Generate dynamic folder structure
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const key = `${folder}/${mediaType}/${year}/${month}/${day}/user-${userId}/${Date.now()}-${sanitizedFilename}`;

    const uploadUrl = await this.r2StorageService.getPresignedUploadUrl(
      key,
      contentType,
    );
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return {
      uploadUrl,
      key,
      publicUrl,
    };
  }

  /**
   * Delete uploaded file
   */
  async deleteFile(key: string): Promise<boolean> {
    return this.r2StorageService.deleteFile(key);
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const mediaType = this.getMediaType(file.mimetype);
    let maxSize: number;

    switch (mediaType) {
      case 'image':
        maxSize = this.maxImageSize;
        break;
      case 'video':
        maxSize = this.maxVideoSize;
        break;
      case 'audio':
        maxSize = this.maxAudioSize;
        break;
      default:
        throw new BadRequestException('Unsupported file type');
    }

    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds limit. Maximum size for ${mediaType} files is ${this.formatFileSize(maxSize)}`,
      );
    }
  }

  /**
   * Determine media type from MIME type
   */
  private getMediaType(
    mimeType: string,
  ): 'image' | 'video' | 'audio' | 'other' {
    if (this.supportedImageTypes.includes(mimeType)) {
      return 'image';
    }
    if (this.supportedVideoTypes.includes(mimeType)) {
      return 'video';
    }
    if (this.supportedAudioTypes.includes(mimeType)) {
      return 'audio';
    }
    return 'other';
  }

  /**
   * Sanitize filename for safe storage
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .toLowerCase();
  }

  /**
   * Format file size for human reading
   */
  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
