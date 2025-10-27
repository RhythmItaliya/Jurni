import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListBucketsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ENV_VARS } from '@config/env';

export interface UploadResult {
  key: string;
  url: string;
  publicUrl: string;
  bucket: string;
  size?: number;
  contentType?: string;
}

export interface UploadOptions {
  folder?: string;
  fileName?: string;
  contentType?: string;
  userId?: string;
  generateThumbnail?: boolean;
}

@Injectable()
export class R2StorageService implements OnModuleInit {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;
  private connectionStatus: 'connected' | 'disconnected' | 'error' =
    'disconnected';
  private lastConnectionTest: Date | null = null;

  constructor() {
    this.bucketName = ENV_VARS.R2_BUCKET_NAME;
    this.publicUrl = ENV_VARS.R2_PUBLIC_URL;

    // Validate required environment variables
    this.validateConfiguration();

    this.s3Client = new S3Client({
      region: 'auto', // Cloudflare R2 uses 'auto' region
      endpoint: ENV_VARS.R2_ENDPOINT,
      credentials: {
        accessKeyId: ENV_VARS.R2_ACCESS_KEY_ID,
        secretAccessKey: ENV_VARS.R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true, // Required for R2
    });

    this.logger.log('🚀 R2 Storage Service initialized');
    this.logger.log(`📁 Bucket: ${this.bucketName}`);
    this.logger.log(`🌐 Endpoint: ${ENV_VARS.R2_ENDPOINT}`);
    this.logger.log(`🔧 Environment: ${ENV_VARS.NODE_ENV}`);
  }

  /**
   * Initialize module and test connection
   */
  async onModuleInit() {
    await this.testConnection();
  }

  /**
   * Upload file to Cloudflare R2 with dynamic folder structure
   */
  async uploadFile(
    buffer: Buffer,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    // Validate connection status
    if (this.connectionStatus === 'error') {
      throw new Error(
        'R2 connection is not available. Please check configuration.',
      );
    }

    try {
      const {
        folder = 'uploads',
        fileName,
        contentType = 'application/octet-stream',
        userId,
      } = options;

      // Validate inputs
      this.validateUploadInputs(buffer, options);

      // Generate dynamic folder structure
      const dynamicFolder = this.generateDynamicFolder(folder, userId);

      // Generate unique filename if not provided
      const finalFileName = fileName || this.generateFileName(contentType);

      // Full key with dynamic folder structure
      const key = `${dynamicFolder}/${finalFileName}`;

      const startTime = Date.now();

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // Add metadata for better organization
        Metadata: {
          uploadedAt: new Date().toISOString(),
          userId: userId || 'anonymous',
          originalFolder: folder,
        },
      });

      await this.s3Client.send(command);

      const uploadTime = Date.now() - startTime;
      const publicUrl = `${this.publicUrl}/${key}`;

      if (ENV_VARS.NODE_ENV === 'development') {
      }

      return {
        key,
        url: publicUrl,
        publicUrl,
        bucket: this.bucketName,
        size: buffer.length,
        contentType,
      };
    } catch (error) {
      this.logger.error('Failed to upload file to R2', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Upload multiple files with dynamic folder creation
   */
  async uploadMultipleFiles(
    files: Array<{ buffer: Buffer; options: UploadOptions }>,
    baseFolder: string = 'uploads',
    userId?: string,
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map(({ buffer, options }) =>
      this.uploadFile(buffer, {
        ...options,
        folder: `${baseFolder}/${options.folder || 'misc'}`,
        userId,
      }),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Generate presigned URL for direct client uploads
   */
  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error('Failed to generate presigned URL', error);
      throw new Error(`Presigned URL generation failed: ${error.message}`);
    }
  }

  /**
   * Delete file from R2
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete file: ${key}`, error);
      return false;
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate dynamic folder structure based on date, type, and user
   */
  private generateDynamicFolder(baseFolder: string, userId?: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    let folder = `${baseFolder}/${year}/${month}/${day}`;

    if (userId) {
      folder += `/user-${userId}`;
    }

    return folder;
  }

  /**
   * Generate unique filename with timestamp and random suffix
   */
  private generateFileName(contentType: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = this.getExtensionFromContentType(contentType);

    return `${timestamp}-${randomSuffix}${extension}`;
  }

  /**
   * Get file extension from content type
   */
  private getExtensionFromContentType(contentType: string): string {
    const typeMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
      'video/mp4': '.mp4',
      'video/mpeg': '.mpeg',
      'video/quicktime': '.mov',
      'video/webm': '.webm',
      'video/avi': '.avi',
      'video/x-msvideo': '.avi',
      'audio/mp3': '.mp3',
      'audio/mpeg': '.mp3',
      'audio/wav': '.wav',
      'audio/ogg': '.ogg',
      'audio/aac': '.aac',
      'audio/flac': '.flac',
      'audio/webm': '.webm',
      'audio/m4a': '.m4a',
    };

    return typeMap[contentType] || '.bin';
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{ totalFiles: number; message: string }> {
    // Note: R2 doesn't provide direct bucket statistics through S3 API
    // This would require custom tracking or using Cloudflare Analytics API
    return {
      totalFiles: 0,
      message: 'Storage statistics require custom tracking implementation',
    };
  }

  /**
   * Validate R2 configuration
   */
  private validateConfiguration(): void {
    const requiredEnvVars = [
      'R2_ACCOUNT_ID',
      'R2_ACCESS_KEY_ID',
      'R2_SECRET_ACCESS_KEY',
      'R2_BUCKET_NAME',
      'R2_ENDPOINT',
      'R2_PUBLIC_URL',
    ];

    const missingVars = requiredEnvVars.filter((varName) => {
      const value = ENV_VARS[varName];
      return !value || value.trim() === '';
    });

    if (missingVars.length > 0) {
      const error = `❌ Missing required R2 environment variables: ${missingVars.join(', ')}`;
      this.logger.error(error);
      throw new Error(error);
    }

    this.logger.log('✅ R2 configuration validation passed');
  }

  /**
   * Test connection to Cloudflare R2
   */
  async testConnection(): Promise<boolean> {
    try {
      this.logger.log('🔍 Testing R2 connection (list buckets)...');

      const startTime = Date.now();

      // Test connection by listing buckets (simpler approach)
      const command = new ListBucketsCommand({});
      const result = await this.s3Client.send(command);

      // Check if our configured bucket exists in the list
      const bucketExists = result.Buckets?.some(
        (bucket) => bucket.Name === this.bucketName,
      );

      if (!bucketExists) {
        throw new Error(`Bucket "${this.bucketName}" not found in account`);
      }

      const responseTime = Date.now() - startTime;
      this.connectionStatus = 'connected';
      this.lastConnectionTest = new Date();
      this.logger.log(
        `✅ R2 connection successful, bucket "${this.bucketName}" exists (${responseTime}ms)`,
      );
      return true;
    } catch (error: any) {
      this.connectionStatus = 'error';

      // Provide actionable error messages for common R2 issues
      if (
        error?.name === 'NoSuchBucket' ||
        /NoSuchBucket/i.test(String(error?.message || '')) ||
        error?.message?.includes('not found in account')
      ) {
        this.logger.error(
          `❌ R2 bucket "${this.bucketName}" does not exist. Please create this bucket in your Cloudflare R2 account or update R2_BUCKET_NAME in your environment.`,
        );
      } else {
        this.logger.error('❌ R2 connection failed:', error?.message || error);
      }

      return false;
    }
  }

  /**
   * Get connection status and info
   */
  getConnectionInfo(): {
    status: string;
    lastTested: Date | null;
    bucket: string;
    endpoint: string;
    region: string;
  } {
    return {
      status: this.connectionStatus,
      lastTested: this.lastConnectionTest,
      bucket: this.bucketName,
      endpoint: ENV_VARS.R2_ENDPOINT,
      region: 'auto',
    };
  }

  /**
   * Perform health check
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: Date;
    details: any;
  }> {
    try {
      const connectionTest = await this.testConnection();

      // Test a simple operation (check if bucket exists)
      const bucketExists = await this.fileExists('health-check-test');

      return {
        status: connectionTest ? 'healthy' : 'unhealthy',
        timestamp: new Date(),
        details: {
          connection: this.connectionStatus,
          lastConnectionTest: this.lastConnectionTest,
          bucket: this.bucketName,
          endpoint: ENV_VARS.R2_ENDPOINT,
          testPerformed: true,
        },
      };
    } catch (error) {
      this.logger.error('❌ Health check failed:', error.message);

      return {
        status: 'unhealthy',
        timestamp: new Date(),
        details: {
          error: error.message,
          connection: this.connectionStatus,
          lastConnectionTest: this.lastConnectionTest,
        },
      };
    }
  }

  /**
   * Validate upload inputs
   */
  private validateUploadInputs(buffer: Buffer, options: UploadOptions): void {
    if (!buffer || buffer.length === 0) {
      throw new Error('Invalid buffer: Buffer is empty or null');
    }

    if (buffer.length > 100 * 1024 * 1024) {
      // 100MB limit
      throw new Error(
        `File too large: ${this.formatFileSize(buffer.length)} exceeds 100MB limit`,
      );
    }

    if (options.fileName && options.fileName.length > 255) {
      throw new Error('Filename too long: Maximum 255 characters allowed');
    }

    // Validate content type if provided
    if (options.contentType && !this.isValidContentType(options.contentType)) {
      throw new Error(`Invalid content type: ${options.contentType}`);
    }
  }

  /**
   * Validate content type
   */
  private isValidContentType(contentType: string): boolean {
    const validTypes = [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      // Videos
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/webm',
      'video/avi',
      'video/x-msvideo',
      // Audio
      'audio/mp3',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/flac',
      'audio/webm',
      'audio/m4a',
      // Generic
      'application/octet-stream',
    ];

    return validTypes.includes(contentType);
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
