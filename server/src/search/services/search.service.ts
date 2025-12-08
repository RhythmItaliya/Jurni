import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchDto } from '../dto/search.dto';
import { Post, PostDocument } from '@/posts/models/post.model';
import { User, UserDocument } from '@/users/models';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  /**
   * Search for users by username or name
   * @param query - Search query string
   * @param page - Page number for pagination
   * @param limit - Results per page
   * @returns Array of matching users with limited fields
   */
  async searchUsers(query: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find(
          {
            $or: [
              { username: { $regex: query, $options: 'i' } },
              { firstName: { $regex: query, $options: 'i' } },
              { lastName: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } },
            ],
          },
          {
            username: 1,
            firstName: 1,
            lastName: 1,
            avatarImage: 1,
            bio: 1,
            uuid: 1,
            isPrivate: 1,
          },
        )
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Search for posts by title, description, or hashtags
   * @param query - Search query string
   * @param page - Page number for pagination
   * @param limit - Results per page
   * @returns Array of matching posts
   */
  async searchPosts(query: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.postModel
        .find({
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { hashtags: { $regex: query, $options: 'i' } },
          ],
        })
        .select('_id title description hashtags createdAt authorId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.postModel.countDocuments({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { hashtags: { $regex: query, $options: 'i' } },
        ],
      }),
    ]);

    return {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Search for hashtags
   * @param query - Search query string
   * @param limit - Results limit
   * @returns Array of matching hashtags
   */
  async searchHashtags(query: string, limit: number = 20) {
    // Get unique hashtags from posts
    const hashtags = await this.postModel
      .find({
        hashtags: { $regex: query, $options: 'i' },
      })
      .distinct('hashtags')
      .lean();

    // Filter and limit results in memory since distinct() doesn't support limit()
    const filteredHashtags = hashtags
      .filter((tag) => tag && tag.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit);

    return {
      data: filteredHashtags,
    };
  }

  /**
   * Universal search across users, posts, and hashtags
   * @param query - Search query string
   * @param page - Page number
   * @param limit - Results per page
   * @returns Combined search results
   */
  async searchAll(query: string, page: number = 1, limit: number = 20) {
    const [usersResult, postsResult, hashtagsResult] = await Promise.all([
      this.searchUsers(query, 1, 5), // Get top 5 users
      this.searchPosts(query, page, limit),
      this.searchHashtags(query, 5), // Get top 5 hashtags
    ]);

    return {
      users: usersResult.data,
      posts: postsResult.data,
      hashtags: hashtagsResult.data,
      pagination: postsResult.pagination,
    };
  }
}
