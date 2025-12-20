import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { LocationData } from '@/types/location.types';

export class CreateProfileDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Software developer passionate about creating amazing apps',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({
    description: 'User cover image media object',
    required: false,
    example: {
      key: 'profiles/covers/image/2025/11/16/user-123/cover.jpg',
      url: 'https://r2-url.com/cover.jpg',
      publicUrl: 'https://pub-r2-url.com/cover.jpg',
      bucket: 'jurni-bucket',
      size: 1024000,
      contentType: 'image/jpeg',
      mediaId: '507f1f77bcf86cd799439011',
    },
  })
  @IsOptional()
  @IsObject()
  coverImage?: {
    key: string;
    url: string;
    publicUrl: string;
    bucket: string;
    size?: number;
    contentType?: string;
    mediaId?: string;
  };

  @ApiProperty({
    description: 'User location with detailed Nominatim data',
    required: false,
  })
  @IsOptional()
  @IsObject()
  location?: LocationData;

  @ApiProperty({
    description: 'Is profile private',
    example: false,
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}

export class UpdateProfileDto extends CreateProfileDto {}

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Profile ID',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  _id: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: String,
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: String,
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Software developer passionate about creating amazing apps',
    type: String,
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'User cover image media object',
    required: false,
  })
  coverImage?: {
    key: string;
    url: string;
    publicUrl: string;
    bucket: string;
    size?: number;
    contentType?: string;
    mediaId?: string;
  };

  @ApiProperty({
    description: 'User location with detailed Nominatim data',
    required: false,
  })
  location?: LocationData;

  @ApiProperty({
    description: 'Is profile private',
    example: false,
    type: Boolean,
  })
  isPrivate: boolean;

  @ApiProperty({
    description: 'Profile creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'Profile last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
  })
  updatedAt: string;
}

export class PublicProfileResponseDto {
  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
    type: String,
  })
  username: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: String,
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: String,
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Software developer passionate about creating amazing apps',
    type: String,
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'User cover image media object',
    required: false,
  })
  coverImage?: {
    key: string;
    url: string;
    publicUrl: string;
    bucket: string;
    size?: number;
    contentType?: string;
    mediaId?: string;
  };

  @ApiProperty({
    description: 'User location with detailed Nominatim data',
    required: false,
  })
  location?: LocationData;

  @ApiProperty({
    description: 'Is profile private',
    example: false,
    type: Boolean,
  })
  isPrivate: boolean;

  @ApiProperty({
    description: 'User avatar image media object',
    required: false,
    example: {
      key: 'profiles/avatars/image/2025/11/16/user-123/avatar.jpg',
      url: 'https://r2-url.com/avatar.jpg',
      publicUrl: 'https://pub-r2-url.com/avatar.jpg',
      bucket: 'jurni-bucket',
      size: 512000,
      contentType: 'image/jpeg',
      mediaId: '507f1f77bcf86cd799439011',
    },
  })
  avatarImage?: {
    key: string;
    url: string;
    publicUrl: string;
    bucket: string;
    size?: number;
    contentType?: string;
    mediaId?: string;
  };
}

/**
 * Complete profile response DTO for editing
 * Includes ALL fields from both User and Profile tables
 */
export class CompleteProfileResponseDto {
  // User table fields
  @ApiProperty({
    description: 'MongoDB User ID',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'User UUID',
    example: '609a8703-1574-47ea-a0e2-e2c4e7180446',
  })
  uuid: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User avatar image media object',
    required: false,
    nullable: true,
    example: {
      key: 'profiles/avatars/image/2025/11/16/user-123/avatar.jpg',
      url: 'https://r2-url.com/avatar.jpg',
      publicUrl: 'https://pub-r2-url.com/avatar.jpg',
      bucket: 'jurni-bucket',
      size: 512000,
      contentType: 'image/jpeg',
      mediaId: '507f1f77bcf86cd799439011',
    },
  })
  avatarImage: {
    key: string;
    url: string;
    publicUrl: string;
    bucket: string;
    size?: number;
    contentType?: string;
    mediaId?: string;
  } | null;

  @ApiProperty({
    description: 'Is user account active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'OTP verification timestamp',
    example: '2025-10-28T12:50:09.672Z',
    required: false,
    nullable: true,
  })
  otpVerifiedAt: string | null;

  @ApiProperty({
    description: 'User account creation timestamp',
    example: '2025-10-28T12:50:09.677Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'User account last update timestamp',
    example: '2025-10-28T12:50:09.677Z',
  })
  updatedAt: string;

  // Profile table fields
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    description: 'User bio',
    example: 'Software developer',
    required: false,
    nullable: true,
  })
  bio: string | null;

  @ApiProperty({
    description: 'User cover image media object',
    required: false,
    nullable: true,
  })
  coverImage: {
    key: string;
    url: string;
    publicUrl: string;
    bucket: string;
    size?: number;
    contentType?: string;
    mediaId?: string;
  } | null;

  @ApiProperty({
    description: 'User location with detailed Nominatim data',
    required: false,
    nullable: true,
  })
  location: LocationData | null;

  @ApiProperty({
    description: 'Is profile private',
    example: false,
  })
  isPrivate: boolean;

  // Statistics
  @ApiProperty({
    description: 'Total number of posts by this user',
    example: 42,
  })
  totalPosts: number;

  @ApiProperty({
    description: 'Total likes received on all user posts from other users',
    example: 256,
  })
  totalLikes: number;

  @ApiProperty({
    description: 'Total saves received on all user posts from other users',
    example: 89,
  })
  totalSaves: number;

  @ApiProperty({
    description: 'Total posts this user has saved',
    example: 15,
  })
  totalSavedPosts: number;

  @ApiProperty({
    description: 'Total posts this user has liked',
    example: 127,
  })
  totalLikedPosts: number;

  @ApiProperty({
    description: 'Total followers of this user',
    example: 150,
  })
  followersCount: number;

  @ApiProperty({
    description: 'Total users this user is following',
    example: 89,
  })
  followingCount: number;
}
