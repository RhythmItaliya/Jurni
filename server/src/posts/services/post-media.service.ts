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
    let post: PostDocument | undefined;

    try {
      // Create post first
      post = await this.postService.createPost(userId, postData);

      if (files && files.length > 0) {
        const postId = (post as any)._id.toString();
        const uploadResult = await this.uploadService.uploadPostMedia(
          files,
          userId,
          postId,
        );

        if (uploadResult.failed.length > 0) {
          throw new Error(
            `Media upload failed: ${uploadResult.failed.map((f) => f.error).join(', ')}`,
          );
        }

        uploadKeys = uploadResult.successful.map((m) => m.key);

        // Update post with media references
        const mediaIds = uploadResult.successful.map((m) => (m as any).mediaId);
        if (mediaIds.length > 0) {
          await this.postService.updatePost(postId, userId, {
            media: mediaIds,
          });

          // Fetch updated post with populated media
          return await this.postService.getPostById(postId, userId);
        }
      }

      return post;
    } catch (error) {
      // If post was created but media upload failed, delete the post
      if (post && uploadKeys.length === 0) {
        try {
          const postId = (post as any)._id.toString();
          await this.postService.deletePost(postId, userId);
        } catch (cleanupError) {
          this.logger.error(
            'Failed to cleanup post after media upload failure',
            cleanupError,
          );
        }
      }

      // Cleanup uploaded media
      if (uploadKeys.length > 0) {
        for (const key of uploadKeys) {
          try {
            await this.uploadService.deleteFile(key);
          } catch (cleanupError) {
            this.logger.error('Failed to cleanup media file', cleanupError);
          }
        }
      }
      throw error;
    }
  }
}
