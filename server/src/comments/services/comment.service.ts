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
import { Comment, CommentDocument } from '@/comments/models/comment.model';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentQueryDto,
  CommentResponseDto,
} from '@/comments/dto';
import { PostService } from '@/posts/services/post.service';
import { CommentUtils } from '@/comments/utils/comment.utils';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @Inject(forwardRef(() => PostService))
    private postService: PostService,
  ) {}

  /**
   * Create a new comment
   */
  async createComment(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDocument> {
    // Verify post exists and allows comments
    try {
      await this.postService.getPostById(postId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Post not found');
      }
      throw error;
    }

    // Check if post allows comments by getting the post data
    const post = await this.postService.getPostById(postId);
    if (!post.allowComments) {
      throw new BadRequestException('Comments are not allowed on this post');
    }

    // If this is a reply, verify parent comment exists
    if (createCommentDto.parentId) {
      const parentComment = await this.commentModel.findById(
        createCommentDto.parentId,
      );
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
      if (parentComment.postId.toString() !== postId) {
        throw new BadRequestException(
          'Parent comment does not belong to this post',
        );
      }
    }

    const commentData = {
      ...createCommentDto,
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
      status: 'active',
      likes: [],
      likesCount: 0,
      repliesCount: 0,
    };

    const comment = new this.commentModel(commentData);
    const savedComment = await comment.save();

    // Update replies count on parent comment if this is a reply
    if (createCommentDto.parentId) {
      await this.commentModel.updateOne(
        { _id: createCommentDto.parentId },
        { $inc: { repliesCount: 1 } },
      );
    }

    return savedComment;
  }

  /**
   * Get comments for a post
   */
  async getCommentsForPost(
    postId: string,
    query: CommentQueryDto = {},
  ): Promise<{
    comments: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Verify post exists
    try {
      await this.postService.getPostById(postId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Post not found');
      }
      throw error;
    }

    return CommentUtils.getCommentsForPost(this.commentModel, postId, query);
  }

  /**
   * Update a comment
   */
  async updateComment(
    userId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    if (comment.status !== 'active') {
      throw new BadRequestException('Cannot update a deleted comment');
    }

    comment.content = updateCommentDto.content;
    comment.updatedAt = new Date();

    return await comment.save();
  }

  /**
   * Delete a comment (soft delete)
   */
  async deleteComment(userId: string, commentId: string): Promise<void> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Soft delete
    comment.status = 'deleted';
    await comment.save();

    // Update replies count on parent comment if this was a reply
    if (comment.parentId) {
      await this.commentModel.updateOne(
        { _id: comment.parentId },
        { $inc: { repliesCount: -1 } },
      );
    }

    // Also soft delete all replies to this comment
    await this.commentModel.updateMany(
      { parentId: comment._id },
      { status: 'deleted' },
    );
  }

  /**
   * Like/unlike a comment
   */
  async toggleCommentLike(
    userId: string,
    commentId: string,
  ): Promise<{ liked: boolean; likesCount: number }> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.status !== 'active') {
      throw new BadRequestException('Cannot like a deleted comment');
    }

    const userObjectId = new Types.ObjectId(userId);
    const likeIndex = comment.likes.findIndex(
      (like) => like.toString() === userId,
    );

    let liked: boolean;
    let likesCount: number;

    if (likeIndex > -1) {
      // User already liked, remove like
      comment.likes.splice(likeIndex, 1);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
      liked = false;
    } else {
      // User hasn't liked, add like
      comment.likes.push(userObjectId);
      comment.likesCount += 1;
      liked = true;
    }

    await comment.save();
    likesCount = comment.likesCount;

    return { liked, likesCount };
  }

  /**
   * Find comment by ID
   */
  async findCommentById(commentId: string): Promise<CommentDocument | null> {
    return await this.commentModel.findById(commentId);
  }

  /**
   * Get comment statistics for a post
   */
  async getCommentStats(
    postId: string,
  ): Promise<{ totalComments: number; totalReplies: number }> {
    const [totalComments, totalReplies] = await Promise.all([
      this.commentModel.countDocuments({
        postId: new Types.ObjectId(postId),
        status: 'active',
        parentId: { $exists: false },
      }),
      this.commentModel.countDocuments({
        postId: new Types.ObjectId(postId),
        status: 'active',
        parentId: { $exists: true },
      }),
    ]);

    return { totalComments, totalReplies };
  }

  /**
   * Delete all comments for a post (used when post is deleted)
   */
  async deleteCommentsForPost(postId: string): Promise<void> {
    await this.commentModel.updateMany(
      { postId: new Types.ObjectId(postId) },
      { status: 'deleted' },
    );
  }

  /**
   * Update the like count for a comment
   */
  async updateCommentLikeCount(
    commentId: string,
    increment: number,
  ): Promise<void> {
    await this.commentModel.updateOne(
      { _id: new Types.ObjectId(commentId) },
      { $inc: { likesCount: increment } },
    );
  }

  /**
   * Get comments count for a post
   */
  async getCommentsCountForPost(postId: string): Promise<number> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('Invalid post ID');
    }

    return await this.commentModel.countDocuments({
      postId: new Types.ObjectId(postId),
      status: 'active',
    });
  }
}
