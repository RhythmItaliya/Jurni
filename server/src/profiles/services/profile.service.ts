import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../models/profile.model';
import { UserService } from '@users/services/user.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
  PublicProfileResponseDto,
} from '../dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private userService: UserService,
  ) {}

  async createProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<ProfileDocument> {
    const profile = new this.profileModel({
      user: userId,
      ...createProfileDto,
    });
    return profile.save();
  }

  async getProfileByUserId(userId: string): Promise<Profile | null> {
    return this.profileModel.findOne({ user: userId }).exec();
  }

  async getProfileByUsername(
    username: string,
    viewerId?: string,
  ): Promise<PublicProfileResponseDto> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.getProfileByUserId((user as any)._id.toString());

    // If profile doesn't exist, return basic user info
    if (!profile) {
      return {
        username: user.username,
        firstName: undefined,
        lastName: undefined,
        bio: undefined,
        website: undefined,
        location: undefined,
        isPrivate: false,
        avatarUrl: user.avatarUrl,
      };
    }

    // If profile is private and viewer is not the owner
    if (profile.isPrivate && viewerId !== (user as any)._id.toString()) {
      return {
        username: user.username,
        firstName: undefined,
        lastName: undefined,
        bio: undefined,
        website: undefined,
        location: undefined,
        isPrivate: true,
        avatarUrl: user.avatarUrl,
      };
    }

    // Return full profile
    return {
      username: user.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      website: profile.website,
      location: profile.location,
      isPrivate: profile.isPrivate,
      avatarUrl: user.avatarUrl,
    };
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDocument> {
    const existingProfile = await this.getProfileByUserId(userId);

    if (!existingProfile) {
      // Create profile if it doesn't exist
      return this.createProfile(userId, updateProfileDto);
    } else {
      // Update existing profile
      const updated = await this.profileModel
        .findOneAndUpdate(
          { user: userId },
          { $set: updateProfileDto },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new NotFoundException('Profile not found');
      }
      return updated;
    }
  }

  async deleteProfile(userId: string): Promise<void> {
    await this.profileModel.deleteOne({ user: userId }).exec();
  }
}
