import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '@/users/models';
import { Post, PostDocument } from '@/posts/models/post.model';
import { Follow, FollowDocument } from '@/follows/models/follow.model';
import { Profile, ProfileDocument } from '@/profiles/models/profile.model';

@Injectable()
export class SuggestionsService {
  private readonly logger = new Logger(SuggestionsService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  /**
   * Get user suggestions for the current user
   * Returns users that the current user is not following
   * @param currentUserUuid - UUID of the current user
   * @param limit - Number of suggestions to return
   * @returns Array of user suggestions with follow status
   */
  async getUserSuggestions(
    currentUserUuid: string,
    limit: number = 10,
  ): Promise<any[]> {
    try {
      // Get the current user by UUID to get their MongoDB _id
      const currentUser = await this.userModel
        .findOne({ uuid: currentUserUuid })
        .select('_id uuid')
        .lean();

      if (!currentUser) {
        this.logger.warn(`User not found: ${currentUserUuid}`);
        return [];
      }

      // Get users that current user is following (stored as UUID strings)
      const following = await this.followModel
        .find({ follower: currentUserUuid })
        .select('following')
        .lean();

      const followingUuids = following.map((f) => f.following);

      // Get users that follow the current user (stored as UUID strings)
      const followers = await this.followModel
        .find({ following: currentUserUuid })
        .select('follower')
        .lean();

      const followerUuids = followers.map((f) => f.follower);

      // Build query - exclude self and followed users
      const query: any = {
        uuid: {
          $ne: currentUserUuid,
          $nin: followingUuids,
        },
      };

      // Only filter by active status if the field exists in data
      // Otherwise, return all users
      const suggestions = await this.userModel
        .find(query)
        .select('_id uuid username avatarImage')
        .limit(limit)
        .lean();

      // Enrich with profile data and follow counts
      const enrichedSuggestions = await Promise.all(
        suggestions.map(async (user) => {
          const profile = await this.profileModel
            .findOne({ user: user._id })
            .select('bio location firstName lastName')
            .lean();

          const followersCount = await this.followModel.countDocuments({
            following: user.uuid,
          });

          const followingCount = await this.followModel.countDocuments({
            follower: user.uuid,
          });

          const isFollower = followerUuids.includes(user.uuid);

          return {
            _id: user._id,
            uuid: user.uuid,
            username: user.username,
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            avatarImage: user.avatarImage,
            bio: profile?.bio || '',
            location: profile?.location || null,
            followersCount,
            followingCount,
            isFollower, // If they follow current user
          };
        }),
      );

      return enrichedSuggestions;
    } catch (error) {
      this.logger.error(
        `Error getting user suggestions: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Get trending hashtags
   * Returns hashtags with the highest post count in the last 30 days
   * @param limit - Number of hashtags to return
   * @returns Array of trending hashtags with post count
   */
  async getTrendingHashtags(limit: number = 10): Promise<any[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const hashtags = await this.postModel
        .aggregate([
          {
            $match: {
              status: 'active',
              visibility: 'public',
              createdAt: { $gte: thirtyDaysAgo },
              hashtags: { $exists: true, $ne: [] },
            },
          },
          {
            $unwind: '$hashtags',
          },
          {
            $group: {
              _id: '$hashtags',
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $limit: limit,
          },
          {
            $project: {
              _id: 0,
              hashtag: '$_id',
              count: 1,
            },
          },
        ])
        .exec();

      return hashtags;
    } catch (error) {
      this.logger.error(
        `Error getting trending hashtags: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Track visitor click on a profile
   * Stores profile view information for analytics
   * @param visitorUserId - ID of the user visiting (optional, can be null for anonymous)
   * @param visitedUserId - ID of the user being visited
   * @returns Success status
   */
  async trackProfileView(
    visitorUserId: string | null,
    visitedUserId: string,
  ): Promise<boolean> {
    try {
      // Log profile view for analytics (can be extended to store in a Views collection)
      this.logger.log(
        `Profile view: ${visitorUserId || 'anonymous'} -> ${visitedUserId}`,
      );

      // You could store this in a Views collection for later analytics
      // For now, just log it for tracking purposes

      return true;
    } catch (error) {
      this.logger.error(`Error tracking profile view: ${error.message}`);
      return false;
    }
  }

  /**
   * Get featured users based on follower count and activity
   * @param limit - Number of featured users to return
   * @returns Array of featured users
   */
  async getFeaturedUsers(limit: number = 10): Promise<any[]> {
    try {
      // Get users with most followers and recent activity
      const users = await this.userModel
        .find({ status: 'active' })
        .select('_id uuid username firstName lastName avatarImage bio')
        .limit(limit)
        .lean();

      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          const profile = await this.profileModel
            .findOne({ user: user._id })
            .select('bio firstName lastName')
            .lean();

          const followersCount = await this.followModel.countDocuments({
            following: user.uuid,
          });

          const followingCount = await this.followModel.countDocuments({
            follower: user.uuid,
          });

          const postCount = await this.postModel.countDocuments({
            userId: user._id,
            status: 'active',
          });

          return {
            _id: user._id,
            uuid: user.uuid,
            username: user.username,
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            avatarImage: user.avatarImage,
            bio: profile?.bio || '',
            followersCount,
            followingCount,
            postCount,
          };
        }),
      );

      return enrichedUsers.sort((a, b) => b.followersCount - a.followersCount);
    } catch (error) {
      this.logger.error(
        `Error getting featured users: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }

  /**
   * Get related hashtags based on a given hashtag
   * Returns hashtags that frequently co-appear in posts
   * @param hashtag - Base hashtag to find related ones
   * @param limit - Number of related hashtags to return
   * @returns Array of related hashtags
   */
  async getRelatedHashtags(
    hashtag: string,
    limit: number = 10,
  ): Promise<any[]> {
    try {
      // Find posts with the given hashtag
      const postsWithHashtag = await this.postModel
        .find({
          hashtags: hashtag,
          status: 'active',
          visibility: 'public',
        })
        .select('hashtags')
        .lean();

      // Extract other hashtags from those posts
      const relatedHashtagsMap = new Map<string, number>();

      postsWithHashtag.forEach((post) => {
        post.hashtags.forEach((tag) => {
          if (tag !== hashtag) {
            relatedHashtagsMap.set(tag, (relatedHashtagsMap.get(tag) || 0) + 1);
          }
        });
      });

      // Sort by frequency and limit
      const relatedHashtags = Array.from(relatedHashtagsMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag, count]) => ({
          hashtag: tag,
          count,
        }));

      return relatedHashtags;
    } catch (error) {
      this.logger.error(
        `Error getting related hashtags: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }
}
