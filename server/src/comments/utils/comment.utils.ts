import { Model } from 'mongoose';
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
      .populate('userId', 'username')
      .populate('parentId', '_id content userId')
      .sort({ createdAt: -1 });
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
