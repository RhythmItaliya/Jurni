import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like, LikeDocument } from '@/likes/models/like.model';
import { CreateLikeDto, LikeStatsDto } from '@/likes/dto/like.dto';
import { PostService } from '@/posts/services/post.service';
import { CommentService } from '@/comments/services/comment.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @Inject(forwardRef(() => PostService)) private postService: PostService,
    private commentService: CommentService,
  ) {}

  /**
   * Like a post or comment
   */
  async likeTarget(
    userId: string,
    createLikeDto: CreateLikeDto,
  ): Promise<LikeDocument> {
    const { targetType, targetId } = createLikeDto;

    // Validate target exists and allows likes
    if (targetType === 'post') {
      await this.validatePostCanBeLiked(targetId);
    } else if (targetType === 'comment') {
      await this.validateCommentCanBeLiked(targetId);
    }

    // Check if user already liked this target
    const existingLike = await this.likeModel.findOne({
      userId: new Types.ObjectId(userId),
      targetType,
      targetId: new Types.ObjectId(targetId),
    });

    if (existingLike) {
      throw new BadRequestException('You have already liked this item');
    }

    // Create the like
    const like = new this.likeModel({
      userId: new Types.ObjectId(userId),
      targetType,
      targetId: new Types.ObjectId(targetId),
    });

    const savedLike = await like.save();

    // Update the target's like count
    await this.updateTargetLikeCount(targetType, targetId, 1);

    return savedLike;
  }

  /**
   * Unlike a post or comment
   */
  async unlikeTarget(
    userId: string,
    targetType: 'post' | 'comment',
    targetId: string,
  ): Promise<void> {
    const like = await this.likeModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      targetType,
      targetId: new Types.ObjectId(targetId),
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    // Update the target's like count
    await this.updateTargetLikeCount(targetType, targetId, -1);
  }

  /**
   * Get like statistics for a target
   */
  async getLikeStats(
    targetType: 'post' | 'comment',
    targetId: string,
    userId?: string,
  ): Promise<LikeStatsDto> {
    const totalLikes = await this.likeModel.countDocuments({
      targetType,
      targetId: new Types.ObjectId(targetId),
    });

    let isLikedByUser = false;
    if (userId) {
      const userLike = await this.likeModel.findOne({
        userId: new Types.ObjectId(userId),
        targetType,
        targetId: new Types.ObjectId(targetId),
      });
      isLikedByUser = !!userLike;
    }

    return {
      totalLikes,
      isLikedByUser,
    };
  }

  /**
   * Get likes for a target with user details
   */
  async getLikesForTarget(
    targetType: 'post' | 'comment',
    targetId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    likes: LikeDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      this.likeModel
        .find({
          targetType,
          targetId: new Types.ObjectId(targetId),
        })
        .populate('userId', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.likeModel.countDocuments({
        targetType,
        targetId: new Types.ObjectId(targetId),
      }),
    ]);

    return {
      likes: likes as unknown as LikeDocument[],
      total,
      page,
      limit,
    };
  }

  /**
   * Validate that a post exists and allows likes
   */
  private async validatePostCanBeLiked(postId: string): Promise<void> {
    try {
      const post = await this.postService.getPostById(postId);
      if (!post.allowLikes) {
        throw new BadRequestException('Likes are not allowed on this post');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Post not found');
      }
      throw error;
    }
  }

  /**
   * Validate that a comment exists and can be liked
   */
  private async validateCommentCanBeLiked(commentId: string): Promise<void> {
    // For now, assume all active comments can be liked
    // We could add allowLikes to comments later if needed
    const comment = await this.commentService.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.status !== 'active') {
      throw new BadRequestException('Cannot like a deleted comment');
    }
  }

  /**
   * Update the like count on the target (post or comment)
   */
  private async updateTargetLikeCount(
    targetType: 'post' | 'comment',
    targetId: string,
    increment: number,
  ): Promise<void> {
    if (targetType === 'post') {
      // For now, posts don't have like count fields
      // This could be added later if needed
    } else if (targetType === 'comment') {
      await this.commentService.updateCommentLikeCount(targetId, increment);
    }
  }

  /**
   * Delete all likes for a target (used when target is deleted)
   */
  async deleteLikesForTarget(
    targetType: 'post' | 'comment',
    targetId: string,
  ): Promise<void> {
    await this.likeModel.deleteMany({
      targetType,
      targetId: new Types.ObjectId(targetId),
    });
  }

  /**
   * Get likes for a user
   */
  async getLikesForUser(
    userId: string,
    targetType: 'post' | 'comment',
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    likes: LikeDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      this.likeModel
        .find({
          userId: new Types.ObjectId(userId),
          targetType,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.likeModel.countDocuments({
        userId: new Types.ObjectId(userId),
        targetType,
      }),
    ]);

    return {
      likes: likes as unknown as LikeDocument[],
      total,
      page,
      limit,
    };
  }
}
