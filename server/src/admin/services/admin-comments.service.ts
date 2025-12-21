import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '@/comments/models/comment.model';

@Injectable()
export class AdminCommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async getAllComments(options?: { page?: number; limit?: number }) {
    const { page = 1, limit = 12 } = options || {};

    const skip = (page - 1) * limit;
    const total = await this.commentModel.countDocuments();

    const comments = await this.commentModel
      .find()
      .populate('userId', 'username email fullName avatarImage')
      .populate({
        path: 'postId',
        select: 'title userId',
        populate: {
          path: 'userId',
          select: 'username avatarImage',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteComment(commentId: string) {
    const result = await this.commentModel.findByIdAndDelete(commentId);

    if (!result) {
      throw new NotFoundException('Comment not found');
    }

    return { message: 'Comment deleted successfully' };
  }

  async getStats() {
    const total = await this.commentModel.countDocuments();

    return { total };
  }
}
