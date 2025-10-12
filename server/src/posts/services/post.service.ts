import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from '../models/post.model';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from '../dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  /**
   * Create a new post
   */
  async createPost(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<PostDocument> {
    const postData = {
      ...createPostDto,
      userId: new Types.ObjectId(userId),
      status: 'active',
      // Set default values for boolean fields if not provided
      allowComments: createPostDto.allowComments ?? true,
      allowLikes: createPostDto.allowLikes ?? true,
      allowShares: createPostDto.allowShares ?? true,
    };

    const post = new this.postModel(postData);
    return await post.save();
  }

  /**
   * Get posts with filtering, sorting, and pagination
   */
  async getPosts(
    query: PostQueryDto,
    requestingUserId?: string,
  ): Promise<{
    posts: PostDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const {
        userId,
        visibility,
        hashtag,
        location,
        search,
        sortBy = 'recent',
        page = 1,
        limit = 10,
        dateFrom,
        dateTo,
      } = query;

      // Build filter
      const filter: any = { status: 'active' };

      // User filter
      if (userId) {
        filter.userId = new Types.ObjectId(userId);
      }

      // Visibility filter
      if (visibility) {
        filter.visibility = visibility;
      } else if (!requestingUserId) {
        filter.visibility = 'public';
      }

      // Hashtag filter
      if (hashtag) {
        filter.hashtags = { $in: [hashtag.toLowerCase()] };
      }

      // Location filter
      if (location) {
        filter['location.name'] = { $regex: location, $options: 'i' };
      }

      // Search filter
      if (search) {
        filter.$text = { $search: search };
      }

      // Date range filter
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo);
      }

      // Build sort
      let sort: any = {};
      switch (sortBy) {
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        default: // recent, popular, trending
          sort = { createdAt: -1 };
      }

      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        this.postModel
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate('userId', 'username fullName avatar')
          .exec(),
        this.postModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        posts,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve posts');
    }
  }

  /**
   * Get a single post by ID
   */
  async getPostById(
    postId: string,
    requestingUserId?: string,
  ): Promise<PostDocument> {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new BadRequestException('Invalid post ID');
      }

      const post = await this.postModel
        .findOne({ _id: postId, status: 'active' })
        .populate('userId', 'username fullName avatar')
        .exec();

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Simple visibility check
      if (
        post.visibility === 'private' &&
        (!requestingUserId || post.userId.toString() !== requestingUserId)
      ) {
        throw new ForbiddenException('This post is private');
      }

      return post;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to retrieve post');
    }
  }

  /**
   * Update a post
   */
  async updatePost(
    postId: string,
    userId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostDocument> {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new BadRequestException('Invalid post ID');
      }

      const post = await this.postModel.findOne({
        _id: postId,
        status: 'active',
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.userId.toString() !== userId) {
        throw new ForbiddenException('You can only edit your own posts');
      }

      const updatedPost = await this.postModel
        .findByIdAndUpdate(postId, updatePostDto, { new: true })
        .populate('userId', 'username fullName avatar')
        .exec();

      return updatedPost!;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to update post');
    }
  }

  /**
   * Delete a post (soft delete)
   */
  async deletePost(postId: string, userId: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new BadRequestException('Invalid post ID');
      }

      const post = await this.postModel.findOne({
        _id: postId,
        status: 'active',
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.userId.toString() !== userId) {
        throw new ForbiddenException('You can only delete your own posts');
      }

      await this.postModel.findByIdAndUpdate(postId, { status: 'deleted' });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to delete post');
    }
  }
}
