import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow, FollowDocument } from '../models/follow.model';
import { User, UserDocument } from '@users/models/user.schema';
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

    // Get followers
    const followers = await this.followModel
      .find({ following: userId })
      .populate('follower', 'uuid username firstName lastName avatarImage')
      .exec();

    return followers.map((follow) => ({
      uuid: (follow.follower as any).uuid,
      username: (follow.follower as any).username,
      firstName: (follow.follower as any).firstName,
      lastName: (follow.follower as any).lastName,
      avatarImage: (follow.follower as any).avatarImage,
    }));
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

    // Get following
    const following = await this.followModel
      .find({ follower: userId })
      .populate('following', 'uuid username firstName lastName avatarImage')
      .exec();

    return following.map((follow) => ({
      uuid: (follow.following as any).uuid,
      username: (follow.following as any).username,
      firstName: (follow.following as any).firstName,
      lastName: (follow.following as any).lastName,
      avatarImage: (follow.following as any).avatarImage,
    }));
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
