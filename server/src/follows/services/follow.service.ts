import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow, FollowDocument } from '../models/follow.model';
import { User, UserDocument } from '@users/models/user.schema';
import { Profile, ProfileDocument } from '../../profiles/models/profile.model';
import { UserService } from '@users/services/user.service';
import {
  FollowUserInfoDto,
  FollowersResponseDto,
  FollowingResponseDto,
  FollowStatusResponseDto,
} from '../dto/follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private userService: UserService,
  ) {}

  /**
   * Follow a user
   * @param followerId - UUID of the user doing the following
   * @param targetUserId - UUID of the user to follow
   */
  async followUser(followerId: string, targetUserId: string): Promise<void> {
    // Check if users exist
    const [follower, targetUser] = await Promise.all([
      this.userService.findByUuid(followerId),
      this.userService.findByUuid(targetUserId),
    ]);

    if (!follower) {
      throw new NotFoundException('Follower user not found');
    }

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Prevent self-following
    if (followerId === targetUserId) {
      throw new ConflictException('Cannot follow yourself');
    }

    // Check if already following
    const existingFollow = await this.followModel.findOne({
      follower: followerId,
      following: targetUserId,
    });

    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

    // Create follow relationship
    const follow = new this.followModel({
      follower: followerId,
      following: targetUserId,
    });

    await follow.save();
  }

  /**
   * Unfollow a user
   * @param followerId - UUID of the user doing the unfollowing
   * @param targetUserId - UUID of the user to unfollow
   */
  async unfollowUser(followerId: string, targetUserId: string): Promise<void> {
    const result = await this.followModel.deleteOne({
      follower: followerId,
      following: targetUserId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Follow relationship not found');
    }
  }

  /**
   * Get followers of a user
   * @param userId - UUID of the user
   * @param currentUserId - UUID of the current user (for privacy checks)
   */
  async getFollowers(
    userId: string,
    currentUserId?: string,
  ): Promise<FollowUserInfoDto[]> {
    // Check if user exists
    const user = await this.userService.findByUuid(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get follower UUIDs
    const followRecords = await this.followModel
      .find({ following: userId })
      .select('follower')
      .lean()
      .exec();

    if (followRecords.length === 0) {
      return [];
    }

    // Extract follower UUIDs
    const followerUuids = followRecords.map((record) => record.follower);

    // Fetch user details by UUID
    const followers = await this.userModel
      .find({ uuid: { $in: followerUuids } })
      .select('uuid username avatarImage')
      .lean()
      .exec();

    // Get profiles for all followers
    const userIds = followers.map((f) => f._id);
    const profiles = await this.profileModel
      .find({ user: { $in: userIds } })
      .select('user firstName lastName')
      .lean()
      .exec();

    // Create a map of userId to profile
    const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

    // If currentUserId is provided, check which users current user is following
    let currentUserFollowing: Set<string> = new Set();
    if (currentUserId) {
      const currentFollowing = await this.followModel
        .find({ follower: currentUserId })
        .select('following')
        .lean()
        .exec();
      currentUserFollowing = new Set(currentFollowing.map((f) => f.following));
    }

    return followers.map((follower) => {
      const profile = profileMap.get(follower._id.toString());
      const isFollowing = currentUserId
        ? currentUserFollowing.has(follower.uuid)
        : false;
      return {
        uuid: follower.uuid,
        username: follower.username,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        avatarImage: follower.avatarImage?.publicUrl,
        isFollowing,
      };
    });
  }

  /**
   * Get users that a user is following
   * @param userId - UUID of the user
   * @param currentUserId - UUID of the current user (for privacy checks)
   */
  async getFollowing(
    userId: string,
    currentUserId?: string,
  ): Promise<FollowUserInfoDto[]> {
    // Check if user exists
    const user = await this.userService.findByUuid(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get following UUIDs
    const followRecords = await this.followModel
      .find({ follower: userId })
      .select('following')
      .lean()
      .exec();

    if (followRecords.length === 0) {
      return [];
    }

    // Extract following UUIDs
    const followingUuids = followRecords.map((record) => record.following);

    // Fetch user details by UUID
    const following = await this.userModel
      .find({ uuid: { $in: followingUuids } })
      .select('uuid username avatarImage')
      .lean()
      .exec();

    // Get profiles for all following users
    const userIds = following.map((f) => f._id);
    const profiles = await this.profileModel
      .find({ user: { $in: userIds } })
      .select('user firstName lastName')
      .lean()
      .exec();

    // Create a map of userId to profile
    const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

    // If currentUserId is provided, check which users current user is following
    let currentUserFollowing: Set<string> = new Set();
    if (currentUserId) {
      const currentFollowing = await this.followModel
        .find({ follower: currentUserId })
        .select('following')
        .lean()
        .exec();
      currentUserFollowing = new Set(currentFollowing.map((f) => f.following));
    }

    return following.map((user) => {
      const profile = profileMap.get(user._id.toString());
      const isFollowing = currentUserId
        ? currentUserFollowing.has(user.uuid)
        : false;
      return {
        uuid: user.uuid,
        username: user.username,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        avatarImage: user.avatarImage?.publicUrl,
        isFollowing,
      };
    });
  }

  /**
   * Check if user is following another user and get counts
   * @param followerId - UUID of the potential follower
   * @param targetUserId - UUID of the target user
   */
  async getFollowStatus(
    followerId: string,
    targetUserId: string,
  ): Promise<{
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
  }> {
    const [isFollowing, followersCount, followingCount] = await Promise.all([
      this.followModel.exists({
        follower: followerId,
        following: targetUserId,
      }),
      this.followModel.countDocuments({ following: targetUserId }),
      this.followModel.countDocuments({ follower: targetUserId }),
    ]);

    return {
      isFollowing: !!isFollowing,
      followersCount,
      followingCount,
    };
  }

  /**
   * Get follow counts for a user
   * @param userId - UUID of the user
   */
  async getFollowCounts(userId: string): Promise<{
    followersCount: number;
    followingCount: number;
  }> {
    const [followersCount, followingCount] = await Promise.all([
      this.followModel.countDocuments({ following: userId }),
      this.followModel.countDocuments({ follower: userId }),
    ]);

    return { followersCount, followingCount };
  }
}
