import { Model, Types } from 'mongoose';
import { CommentDocument } from '@/comments/models/comment.model';

/**
 * Comment utility functions for consistent data retrieval and formatting
 */
export class CommentUtils {
  /**
   * Get populated comment query with consistent field selection
   * @param commentModel - Mongoose comment model
   * @param query - Base query to extend
   * @returns Query with consistent population
   */
  static getPopulatedCommentQuery(
    commentModel: Model<CommentDocument>,
    query: any = {},
  ) {
    return commentModel
      .find(query)
      .populate('userId', '_id uuid username avatarImage')
      .populate('parentId', '_id content userId')
      .sort({ createdAt: -1 });
  }

  /**
   * Get comments for a post with full population and pagination
   * @param commentModel - Mongoose comment model
   * @param postId - Post ID to get comments for
   * @param query - Query parameters (page, limit, parentId)
   * @returns Object with comments array and pagination metadata
   */
  static async getCommentsForPost(
    commentModel: Model<CommentDocument>,
    postId: string,
    query: { page?: number; limit?: number; parentId?: string } = {},
  ) {
    const { page = 1, limit = 10, parentId } = query;
    const skip = (page - 1) * limit;

    // Build query
    const queryFilter: any = {
      postId: new Types.ObjectId(postId),
      status: 'active',
    };

    // If parentId is provided, get replies to that comment
    // If not, get top-level comments (no parentId)
    if (parentId) {
      queryFilter.parentId = new Types.ObjectId(parentId);
    } else {
      queryFilter.parentId = { $exists: false };
    }

    const [comments, total] = await Promise.all([
      this.getPopulatedCommentQuery(commentModel, queryFilter)
        .skip(skip)
        .limit(limit)
        .lean(),
      commentModel.countDocuments(queryFilter),
    ]);

    return {
      comments: this.getFormattedComments(
        comments as unknown as CommentDocument[],
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Format comment document for API response
   * Ensures consistent field structure
   * @param comment - Comment document
   * @returns Formatted comment object
   */
  static formatCommentForResponse(comment: CommentDocument) {
    const commentAny = comment as any;
    return {
      _id: comment._id,
      userId: comment.userId,
      postId: comment.postId,
      content: comment.content,
      parentId: comment.parentId,
      status: comment.status,
      likesCount: comment.likesCount,
      repliesCount: comment.repliesCount,
      createdAt: commentAny.createdAt,
      updatedAt: commentAny.updatedAt,
    };
  }

  /**
   * Get formatted comments array
   * @param comments - Array of comment documents
   * @returns Array of formatted comment objects
   */
  static getFormattedComments(comments: CommentDocument[]) {
    return comments.map((comment) => this.formatCommentForResponse(comment));
  }
}
