import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'User website URL',
    example: 'https://johndoe.com',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'User location',
    example: 'San Francisco, CA',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

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
    description: 'User website URL',
    example: 'https://johndoe.com',
    type: String,
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: 'User location',
    example: 'San Francisco, CA',
    type: String,
    required: false,
  })
  location?: string;

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
    description: 'User website URL',
    example: 'https://johndoe.com',
    type: String,
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: 'User location',
    example: 'San Francisco, CA',
    type: String,
    required: false,
  })
  location?: string;

  @ApiProperty({
    description: 'Is profile private',
    example: false,
    type: Boolean,
  })
  isPrivate: boolean;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    type: String,
    required: false,
  })
  avatarUrl?: string;
}
