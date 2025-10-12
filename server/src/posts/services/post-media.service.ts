import { Injectable, Logger } from '@nestjs/common';
import { PostService } from './post.service';
import { UploadService } from '../../upload/services/upload.service';
import { CreatePostDto } from '../dto';
import { PostDocument } from '../models/post.model';

@Injectable()
export class PostMediaService {
  private readonly logger = new Logger(PostMediaService.name);

  constructor(
    private readonly postService: PostService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Create post with media files atomically
   * If media upload fails, no post is created
   * If post creation fails, uploaded media is cleaned up
   */
  async createPostWithMedia(
    userId: string,
    postData: CreatePostDto,
    files?: Express.Multer.File[],
  ): Promise<PostDocument> {
    let uploadKeys: string[] = [];

    try {
      if (files && files.length > 0) {
        const uploadResult = await this.uploadService.uploadPostMedia(
          files,
          userId,
        );

        if (uploadResult.failed.length > 0) {
          throw new Error(
            `Media upload failed: ${uploadResult.failed.map((f) => f.error).join(', ')}`,
          );
        }

        uploadKeys = uploadResult.successful.map((m) => m.key);
      }

      const post = await this.postService.createPost(userId, postData);
      return post;
    } catch (error) {
      if (uploadKeys.length > 0) {
        for (const key of uploadKeys) {
          try {
            await this.uploadService.deleteFile(key);
          } catch (cleanupError) {
            // Silent cleanup failure
          }
        }
      }
      throw error;
    }
  }
}
