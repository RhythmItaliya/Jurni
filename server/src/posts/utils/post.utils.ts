import { Model, Types } from 'mongoose';
import { PostDocument } from '@/posts/models/post.model';

/**
 * Post utility functions for consistent data retrieval and formatting
 */
export class PostUtils {
  /**
   * Get populated post query with consistent field selection
   * @param postModel - Mongoose post model
   * @param query - Base query to extend
   * @returns Query with consistent population
   */
  static getPopulatedPostQuery(
    postModel: Model<PostDocument>,
    query: any = {},
  ) {
    return postModel
      .find(query)
      .populate('userId', 'username avatarUrl')
      .populate('media');
  }

  /**
   * Get single populated post query with consistent field selection
   * @param postModel - Mongoose post model
   * @param query - Base query to extend
   * @returns Query with consistent population
   */
  static getPopulatedSinglePostQuery(
    postModel: Model<PostDocument>,
    query: any = {},
  ) {
    return postModel
      .findOne(query)
      .populate('userId', 'username avatarUrl')
      .populate('media');
  }

  /**
   * Format post document for API response
   * Ensures consistent field structure
   * @param post - Post document
   * @returns Formatted post object
   */
  static formatPostForResponse(post: PostDocument) {
    return {
      _id: post._id,
      userId: post.userId,
      title: post.title,
      description: post.description,
      hashtags: post.hashtags,
      location: post.location,
      status: post.status,
      visibility: post.visibility,
      allowComments: post.allowComments,
      allowLikes: post.allowLikes,
      allowShares: post.allowShares,
      media: post.media,
      commentsCount: (post as any).commentsCount || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      __v: post.__v,
    };
  }

  /**
   * Format multiple posts for API response
   * @param posts - Array of post documents
   * @returns Array of formatted post objects
   */
  static formatPostsForResponse(posts: PostDocument[]) {
    return posts.map((post) => this.formatPostForResponse(post));
  }

  /**
   * Get posts with consistent formatting and population
   * @param postModel - Mongoose post model
   * @param filter - Query filter
   * @param options - Query options (sort, skip, limit)
   * @returns Promise of formatted posts
   */
  static async getFormattedPosts(
    postModel: Model<PostDocument>,
    filter: any = {},
    options: {
      sort?: any;
      skip?: number;
      limit?: number;
    } = {},
  ): Promise<PostDocument[]> {
    const query = this.getPopulatedPostQuery(postModel, filter);

    if (options.sort) {
      query.sort(options.sort);
    }

    if (options.skip) {
      query.skip(options.skip);
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    const posts = await query.exec();
    return posts;
  }

  /**
   * Get single post with consistent formatting and population
   * @param postModel - Mongoose post model
   * @param filter - Query filter
   * @returns Promise of formatted post or null
   */
  static async getFormattedPost(
    postModel: Model<PostDocument>,
    filter: any = {},
  ): Promise<PostDocument | null> {
    const post = await this.getPopulatedSinglePostQuery(
      postModel,
      filter,
    ).exec();
    return post;
  }

  /**
   * Update post and return formatted result
   * @param postModel - Mongoose post model
   * @param postId - Post ID to update
   * @param updateData - Data to update
   * @returns Promise of updated formatted post
   */
  static async updateAndFormatPost(
    postModel: Model<PostDocument>,
    postId: string | Types.ObjectId,
    updateData: any,
  ): Promise<PostDocument> {
    const updatedPost = await this.getPopulatedSinglePostQuery(postModel)
      .findByIdAndUpdate(postId, updateData, { new: true })
      .exec();

    if (!updatedPost) {
      throw new Error('Post not found after update');
    }

    return updatedPost;
  }
}
