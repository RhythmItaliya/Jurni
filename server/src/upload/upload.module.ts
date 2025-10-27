import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './services/upload.service';
import { R2StorageService } from './services/r2-storage.service';
import { MediaModule } from '@/media/media.module';

@Module({
  imports: [
    MediaModule,
    MulterModule.register({
      // Memory storage for processing before uploading to R2
      storage: undefined, // Uses memory storage by default
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max file size (for videos)
        files: 10, // Max 10 files per request
      },
      fileFilter: (req, file, callback) => {
        // Define allowed file types
        const allowedMimeTypes = [
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
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error(`Unsupported file type: ${file.mimetype}`), false);
        }
      },
    }),
  ],
  providers: [UploadService, R2StorageService],
  exports: [UploadService, R2StorageService],
})
export class UploadModule {}
