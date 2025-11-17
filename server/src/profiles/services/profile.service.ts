import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../models/profile.model';
import { User, UserDocument } from '@users/models/user.schema';
import { UserService } from '@users/services/user.service';
import { UploadService } from '@/upload/services/upload.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
  CompleteProfileResponseDto,
} from '../dto/profile.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UserService,
    private uploadService: UploadService,
  ) {}

  async createProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<ProfileDocument> {
    const existingProfile = await this.profileModel
      .findOne({ user: userId })
      .exec();
    if (existingProfile) {
      return existingProfile;
    }
    const profile = new this.profileModel({
      user: userId,
      ...createProfileDto,
    });
    return profile.save();
  }
  async getProfileByUserId(userId: string): Promise<Profile | null> {
    return this.profileModel.findOne({ user: userId }).exec();
  }

  /**
   * Get complete profile data for current user (for editing)
   * Includes user data and profile data
   */
  async getCompleteProfile(
    userId: string,
  ): Promise<CompleteProfileResponseDto> {
    const user = await this.userService.findByUuid(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get profile, create one if it doesn't exist
    let profile = await this.getProfileByUserId(userId);

    if (!profile) {
      // Create a default profile for this user
      profile = await this.createProfile(userId, {});
    }

    // Combine user and profile data into a clean response
    return {
      // User table fields
      uuid: (user as any).uuid,
      username: user.username,
      email: user.email,
      avatarImage: user.avatarImage ?? null,
      isActive: user.isActive,
      otpVerifiedAt: (user as any).otpVerifiedAt?.toISOString() ?? null,
      createdAt: (user as any).createdAt?.toISOString(),
      updatedAt: (user as any).updatedAt?.toISOString(),

      // Profile table fields
      firstName: profile?.firstName ?? null,
      lastName: profile?.lastName ?? null,
      bio: profile?.bio ?? null,
      coverImage: profile?.coverImage ?? null,
      location: profile?.location ?? null,
      isPrivate: profile?.isPrivate ?? false,
    };
  }

  /**
   * Get public profile data by username
   * Returns full user and profile data for public access
   */
  async getPublicProfileByUsername(
    username: string,
  ): Promise<CompleteProfileResponseDto> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get profile, create one if it doesn't exist
    let profile = await this.getProfileByUserId((user as any)._id.toString());

    if (!profile) {
      // Create a default profile for this user
      profile = await this.createProfile((user as any)._id.toString(), {});
    }

    // Combine user and profile data into a clean response
    return {
      // User table fields
      uuid: (user as any).uuid,
      username: user.username,
      email: user.email,
      avatarImage: user.avatarImage ?? null,
      isActive: user.isActive,
      otpVerifiedAt: (user as any).otpVerifiedAt?.toISOString() ?? null,
      createdAt: (user as any).createdAt?.toISOString(),
      updatedAt: (user as any).updatedAt?.toISOString(),

      // Profile table fields
      firstName: profile?.firstName ?? null,
      lastName: profile?.lastName ?? null,
      bio: profile?.bio ?? null,
      coverImage: profile?.coverImage ?? null,
      location: profile?.location ?? null,
      isPrivate: profile?.isPrivate ?? false,
    };
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDocument> {
    const existingProfile = await this.getProfileByUserId(userId);

    // Prepare update data - only include provided fields
    const updateData: Partial<UpdateProfileDto> = {};

    if (updateProfileDto.firstName !== undefined) {
      updateData.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName !== undefined) {
      updateData.lastName = updateProfileDto.lastName;
    }
    if (updateProfileDto.bio !== undefined) {
      updateData.bio = updateProfileDto.bio;
    }
    if (updateProfileDto.coverImage !== undefined) {
      updateData.coverImage = updateProfileDto.coverImage;
    }
    if (updateProfileDto.location !== undefined) {
      updateData.location = updateProfileDto.location;
    }
    if (updateProfileDto.isPrivate !== undefined) {
      updateData.isPrivate = updateProfileDto.isPrivate;
    }

    if (!existingProfile) {
      // Create profile if it doesn't exist
      return this.createProfile(userId, updateData as CreateProfileDto);
    } else {
      // Update existing profile with only provided fields
      const updated = await this.profileModel
        .findOneAndUpdate(
          { user: userId },
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updated) {
        throw new NotFoundException('Profile not found');
      }

      return updated;
    }
  }

  async updateProfileWithMedia(
    userId: string,
    userMongoId: string,
    updateProfileDto: UpdateProfileDto,
    coverImageFile?: Express.Multer.File,
    avatarImageFile?: Express.Multer.File,
  ): Promise<ProfileDocument> {
    // Get existing profile or create one if it doesn't exist
    let existingProfile = await this.getProfileByUserId(userId);

    if (!existingProfile) {
      existingProfile = await this.createProfile(userId, {});
    }

    // Prepare update data - only include provided fields
    const updateData: Partial<UpdateProfileDto> = {};

    if (updateProfileDto.firstName !== undefined) {
      updateData.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName !== undefined) {
      updateData.lastName = updateProfileDto.lastName;
    }
    if (updateProfileDto.bio !== undefined) {
      updateData.bio = updateProfileDto.bio;
    }
    if (updateProfileDto.location !== undefined) {
      // Parse location if it's a string (from form data)
      if (typeof updateProfileDto.location === 'string') {
        try {
          updateData.location = JSON.parse(updateProfileDto.location as any);
        } catch (e) {
          this.logger.warn('Failed to parse location JSON:', e);
          updateData.location = updateProfileDto.location;
        }
      } else {
        updateData.location = updateProfileDto.location;
      }
    }
    if (updateProfileDto.isPrivate !== undefined) {
      // Convert string boolean to actual boolean (from form data)
      if (typeof updateProfileDto.isPrivate === 'string') {
        updateData.isPrivate = updateProfileDto.isPrivate === 'true';
      } else {
        updateData.isPrivate = updateProfileDto.isPrivate;
      }
    }

    // Handle cover image upload
    if (coverImageFile) {
      try {
        const uploadResult = await this.uploadService.uploadMedia(
          coverImageFile,
          userMongoId,
          'profiles/covers',
        );
        updateData.coverImage = {
          key: uploadResult.key,
          url: uploadResult.url,
          publicUrl: uploadResult.publicUrl,
          bucket: uploadResult.bucket,
          size: uploadResult.size,
          contentType: uploadResult.contentType,
          mediaId: uploadResult.mediaId,
        };
      } catch (error) {
        this.logger.error('Failed to upload cover image:', error);
        throw new Error(`Failed to upload cover image: ${error.message}`);
      }
    }

    // Handle avatar image upload (update user's avatarImage)
    if (avatarImageFile) {
      try {
        const uploadResult = await this.uploadService.uploadMedia(
          avatarImageFile,
          userMongoId, // Use MongoDB ObjectId for media uploads
          'profiles/avatars',
        );

        // Update user's avatarImage with complete media object
        await this.userModel.findOneAndUpdate(
          { uuid: userId },
          {
            $set: {
              avatarImage: {
                key: uploadResult.key,
                url: uploadResult.url,
                publicUrl: uploadResult.publicUrl,
                bucket: uploadResult.bucket,
                size: uploadResult.size,
                contentType: uploadResult.contentType,
                mediaId: uploadResult.mediaId,
              },
            },
          },
          { new: true },
        );
      } catch (error) {
        this.logger.error('Failed to upload avatar image:', error);
        throw new Error(`Failed to upload avatar image: ${error.message}`);
      }
    }

    if (!existingProfile) {
      // Create profile if it doesn't exist
      return this.createProfile(userId, updateData as CreateProfileDto);
    } else {
      // Update existing profile with only provided fields
      const updated = await this.profileModel
        .findOneAndUpdate(
          { user: userId },
          { $set: updateData },
          { new: true, runValidators: true },
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
