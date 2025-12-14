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
import { Post, PostDocument } from '@/posts/models/post.model';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from '@/posts/dto';
import { PostUtils } from '@/posts/utils/post.utils';
import { CommentService } from '@/comments/services/comment.service';
import { LikeService } from '@/likes/services/like.service';
import { SavePostService } from '@/saveposts/services/savepost.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
    private likeService: LikeService,
    private savePostService: SavePostService,
  ) {}

  /**
   * Get total posts count for debugging
   */
  async getPostsCount(): Promise<number> {
    return await this.postModel.countDocuments();
  }

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
      allowComments: createPostDto.allowComments ?? true,
      allowLikes: createPostDto.allowLikes ?? true,
      allowShares: createPostDto.allowShares ?? true,
      allowSaves: createPostDto.allowSaves ?? true,
    };

    const post = new this.postModel(postData);
    const savedPost = await post.save();

    // Populate userId for consistent response
    const populatedPost = await PostUtils.getFormattedPost(this.postModel, {
      _id: savedPost._id,
    });

    if (!populatedPost) {
      throw new Error('Failed to retrieve created post');
    }

    return populatedPost;
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
        locationPlaceId,
        locationLat,
        locationLon,
        search,
        sortBy = 'recent',
        page = 1,
        limit = 2,
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
        // Case-insensitive hashtag matching using regex
        filter.hashtags = { $in: [new RegExp(`^${hashtag}$`, 'i')] };
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
        PostUtils.getFormattedPosts(this.postModel, filter, {
          sort,
          skip,
          limit,
        }),
        this.postModel.countDocuments(filter),
      ]);

      // Add comments count and likes count to each post
      const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
          const [commentsCount, likeStats, saveStats] = await Promise.all([
            this.commentService.getCommentsCountForPost(
              (post as any)._id.toString(),
            ),
            this.likeService.getLikeStats('post', (post as any)._id.toString()),
            this.savePostService.getSaveStats((post as any)._id.toString()),
          ]);
          return {
            ...post.toObject(),
            commentsCount,
            likesCount: likeStats.totalLikes,
            savesCount: saveStats.totalSaves,
          };
        }),
      );

      const totalPages = Math.ceil(total / limit) || 0;

      return {
        posts: postsWithCounts,
        total: total || 0,
        page: page || 1,
        totalPages,
      };
    } catch (error) {
      console.error('getPosts service error:', error);
      // Return empty results instead of throwing error for better UX
      return {
        posts: [],
        total: 0,
        page: query.page || 1,
        totalPages: 0,
      };
    }
  }

  /**
   * Get a single post by ID
   */
  async getPostById(postId: string, requestingUserId?: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new BadRequestException('Invalid post ID');
      }

      const post = await PostUtils.getFormattedPost(this.postModel, {
        _id: postId,
        status: 'active',
      });

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

      // Add counts to the post
      const [commentsCount, likeStats, saveStats] = await Promise.all([
        this.commentService.getCommentsCountForPost(postId),
        this.likeService.getLikeStats('post', postId, requestingUserId),
        this.savePostService.getSaveStats(postId, requestingUserId),
      ]);

      return {
        ...post.toObject(),
        commentsCount,
        likesCount: likeStats.totalLikes,
        savesCount: saveStats.totalSaves,
        isSavedByUser: saveStats.isSavedByUser,
        isLikedByUser: likeStats.isLikedByUser,
      };
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

      const updatedPost = await PostUtils.updateAndFormatPost(
        this.postModel,
        postId,
        updatePostDto,
      );

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

      // Delete all comments for this post
      await this.commentService.deleteCommentsForPost(postId);

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

  /**
   * Get saved posts for a user
   */
  async getSavedPostsForUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    posts: PostDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const { saves, total } = await this.savePostService.getSavedPosts(
        userId,
        page,
        limit,
      );

      const posts = saves
        .map((save) => save.postId as unknown as PostDocument)
        .filter((post) => post && post.status === 'active');

      // Add comments count, likes count, and saves count to each post
      const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
          const postId = (post as any)._id.toString();
          const [commentsCount, likeStats, saveStats] = await Promise.all([
            this.commentService.getCommentsCountForPost(postId),
            this.likeService.getLikeStats('post', postId),
            this.savePostService.getSaveStats(postId),
          ]);
          return {
            ...post.toObject(),
            commentsCount,
            likesCount: likeStats.totalLikes,
            savesCount: saveStats.totalSaves,
          };
        }),
      );

      const totalPages = Math.ceil(total / limit);

      return {
        posts: postsWithCounts as any,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve saved posts: ${error.message}`,
      );
    }
  }

  /**
   * Get liked posts for a user
   */
  async getLikedPostsForUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    posts: PostDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      // Get likes for posts by the user
      const likes = await this.likeService.getLikesForUser(
        userId,
        'post',
        page,
        limit,
      );

      // Extract post IDs from likes
      const postIds = likes.likes.map((like) => like.targetId);

      // Get posts by IDs with media populated
      const posts = await this.postModel
        .find({
          _id: { $in: postIds },
          status: 'active',
        })
        .populate('media')
        .populate('userId', 'username avatarImage')
        .sort({ createdAt: -1 })
        .exec();

      // Add comments count, likes count, and saves count to each post
      const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
          const [commentsCount, likeStats, saveStats] = await Promise.all([
            this.commentService.getCommentsCountForPost(
              (post as any)._id.toString(),
            ),
            this.likeService.getLikeStats('post', (post as any)._id.toString()),
            this.savePostService.getSaveStats((post as any)._id.toString()),
          ]);
          return {
            ...post.toObject(),
            commentsCount,
            likesCount: likeStats.totalLikes,
            savesCount: saveStats.totalSaves,
          };
        }),
      );

      const totalPages = Math.ceil(likes.total / limit);

      return {
        posts: postsWithCounts as any,
        total: likes.total,
        page,
        totalPages,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve liked posts: ${error.message}`,
      );
    }
  }
}
