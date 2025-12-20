import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  ValidateBy,
  ValidationOptions,
} from 'class-validator';

/**
 * Custom validator to ensure user cannot follow themselves
 */
function IsNotSelfFollowing(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isNotSelfFollowing',
      validator: {
        validate: (value: string, args) => {
          // This validation will be checked in the service layer
          // since we need access to the current user ID
          return true; // Always pass at DTO level, validate in service
        },
      },
    },
    validationOptions,
  );
}

/**
 * DTO for following a user
 */
export class FollowUserDto {
  @ApiProperty({
    description: 'UUID of the user to follow',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  @IsNotSelfFollowing({
    message: 'You cannot follow your own account',
  })
  targetUserId: string;
}

/**
 * DTO for unfollowing a user
 */
export class UnfollowUserDto {
  @ApiProperty({
    description: 'UUID of the user to unfollow',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  targetUserId: string;
}

/**
 * Response DTO for follow/unfollow operations
 */
export class FollowResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Successfully followed user',
  })
  message: string;

  @ApiProperty({
    description: 'Additional data',
    required: false,
  })
  data?: any;
}

/**
 * DTO for user in followers/following lists
 */
export class FollowUserInfoDto {
  @ApiProperty({
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uuid: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  firstName?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  lastName?: string;

  @ApiProperty({
    description: 'Avatar image URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatarImage?: string;

  @ApiProperty({
    description: 'Whether current user is following this user',
    example: true,
  })
  isFollowing?: boolean;
}

/**
 * Response DTO for followers list
 */
export class FollowersResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Followers retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Followers data',
    type: [FollowUserInfoDto],
  })
  data: FollowUserInfoDto[];
}

/**
 * Response DTO for following list
 */
export class FollowingResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Following retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Following data',
    type: [FollowUserInfoDto],
  })
  data: FollowUserInfoDto[];
}

/**
 * Response DTO for follow status check
 */
export class FollowStatusResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Follow status retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Follow status data',
  })
  data: {
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
  };
}
