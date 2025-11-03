import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SavePost, SavePostDocument } from '@/saveposts/models/savepost.model';
import {
  CreateSavePostDto,
  SavePostStatsDto,
} from '@/saveposts/dto/savepost.dto';
import { PostService } from '@/posts/services/post.service';

@Injectable()
export class SavePostService {
  constructor(
    @InjectModel(SavePost.name) private savePostModel: Model<SavePostDocument>,
    @Inject(forwardRef(() => PostService)) private postService: PostService,
  ) {}

  /**
   * Save a post
   */
  async savePost(
    userId: string,
    createSavePostDto: CreateSavePostDto,
  ): Promise<SavePostDocument> {
    const { postId } = createSavePostDto;

    // Validate post exists and allows saves
    await this.validatePostCanBeSaved(postId);

    // Check if user already saved this post
    const existingSave = await this.savePostModel.findOne({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });

    if (existingSave) {
      throw new BadRequestException('You have already saved this post');
    }

    const savePost = new this.savePostModel({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });

    return await savePost.save();
  }

  /**
   * Unsave a post
   */
  async unsavePost(userId: string, postId: string): Promise<void> {
    const result = await this.savePostModel.deleteOne({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Save not found');
    }
  }

  /**
   * Get saved posts for a user
   */
  async getSavedPosts(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ saves: SavePostDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const saves = await this.savePostModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('postId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.savePostModel.countDocuments({
      userId: new Types.ObjectId(userId),
    });

    return { saves, total };
  }

  /**
   * Check if a post is saved by a user
   */
  async isPostSavedByUser(userId: string, postId: string): Promise<boolean> {
    const save = await this.savePostModel.findOne({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });

    return !!save;
  }

  /**
   * Get save stats for a post
   */
  async getSaveStats(
    postId: string,
    userId?: string,
  ): Promise<SavePostStatsDto> {
    const totalSaves = await this.savePostModel.countDocuments({
      postId: new Types.ObjectId(postId),
    });

    let isSavedByUser = false;
    if (userId) {
      isSavedByUser = await this.isPostSavedByUser(userId, postId);
    }

    return {
      totalSaves,
      isSavedByUser,
    };
  }

  /**
   * Validate that a post exists and allows saves
   */
  private async validatePostCanBeSaved(postId: string): Promise<void> {
    try {
      const post = await this.postService.getPostById(postId);
      if (!post.allowSaves) {
        throw new BadRequestException('Saves are not allowed on this post');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Post not found');
      }
      throw error;
    }
  }
}
