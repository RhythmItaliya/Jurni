import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  MaxLength,
  MinLength,
  ArrayMaxSize,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const TransformToBoolean = () =>
  Transform(({ value }) => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'true' || lowerValue === '1') return true;
      if (lowerValue === 'false' || lowerValue === '0') return false;
      return true;
    }
    return Boolean(value);
  });

export class LocationDto {
  @ApiProperty({
    description: 'Location name',
    example: 'New York',
    type: String,
  })
  @IsString({ message: 'Location name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: 40.7128,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude?: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -74.006,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude?: number;

  @ApiProperty({
    description: 'Full address',
    example: 'New York, NY, USA',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;
}

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title (1-2200 characters)',
    example: 'My amazing journey today',
    type: String,
    minLength: 1,
    maxLength: 2200,
  })
  @IsString({ message: 'Title must be a string' })
  @MinLength(1, { message: 'Title is required' })
  @MaxLength(2200, { message: 'Title cannot exceed 2200 characters' })
  title: string;

  @ApiProperty({
    description: 'Post description (optional, max 5000 characters)',
    example: 'Today was an incredible day...',
    type: String,
    maxLength: 5000,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(5000, { message: 'Description cannot exceed 5000 characters' })
  description?: string;

  @ApiProperty({
    description: 'Post visibility',
    example: 'public',
    enum: ['public', 'private', 'friends', 'followers'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['public', 'private', 'friends', 'followers'], {
    message: 'Visibility must be one of: public, private, friends, followers',
  })
  visibility?: 'public' | 'private' | 'friends' | 'followers';

  @ApiProperty({
    description: 'Hashtags (optional, max 30 tags)',
    example: ['travel', 'adventure', 'nature'],
    type: [String],
    maxItems: 30,
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Hashtags must be an array' })
  @IsString({ each: true, message: 'Each hashtag must be a string' })
  @ArrayMaxSize(30, { message: 'Cannot have more than 30 hashtags' })
  @Transform(({ value }) =>
    value?.map((tag: string) => tag.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')),
  )
  hashtags?: string[];

  @ApiProperty({
    description: 'Allow comments on this post',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @TransformToBoolean()
  allowComments?: boolean;

  @ApiProperty({
    description: 'Allow likes on this post',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @TransformToBoolean()
  allowLikes?: boolean;

  @ApiProperty({
    description: 'Allow shares of this post',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @TransformToBoolean()
  allowShares?: boolean;

  @ApiProperty({
    description: 'Allow saves of this post',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @TransformToBoolean()
  allowSaves?: boolean;

  @ApiProperty({
    description: 'Location information for the post',
    type: LocationDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post title (1-2200 characters)',
    example: 'My amazing journey today',
    type: String,
    minLength: 1,
    maxLength: 2200,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(2200, { message: 'Title cannot exceed 2200 characters' })
  title?: string;

  @ApiProperty({
    description: 'Post description (optional, max 5000 characters)',
    example: 'Today was an incredible day...',
    type: String,
    maxLength: 5000,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(5000, { message: 'Description cannot exceed 5000 characters' })
  description?: string;

  @ApiProperty({
    description: 'Post visibility',
    example: 'public',
    enum: ['public', 'private', 'friends', 'followers'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['public', 'private', 'friends', 'followers'], {
    message: 'Visibility must be one of: public, private, friends, followers',
  })
  visibility?: 'public' | 'private' | 'friends' | 'followers';

  @ApiProperty({
    description: 'Hashtags (optional, max 30 tags)',
    example: ['travel', 'adventure', 'nature'],
    type: [String],
    maxItems: 30,
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Hashtags must be an array' })
  @IsString({ each: true, message: 'Each hashtag must be a string' })
  @ArrayMaxSize(30, { message: 'Cannot have more than 30 hashtags' })
  @Transform(({ value }) =>
    value?.map((tag: string) => tag.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')),
  )
  hashtags?: string[];

  @ApiProperty({
    description: 'Allow comments on this post',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Allow comments must be a boolean' })
  @Transform(({ value }) => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  allowComments?: boolean;

  @ApiProperty({
    description: 'Allow likes on this post',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Allow likes must be a boolean' })
  @Transform(({ value }) => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  allowLikes?: boolean;

  @ApiProperty({
    description: 'Allow shares of this post',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Allow shares must be a boolean' })
  @Transform(({ value }) => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  allowShares?: boolean;

  @ApiProperty({
    description: 'Allow saves of this post',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Allow saves must be a boolean' })
  @Transform(({ value }) => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  allowSaves?: boolean;

  @ApiProperty({
    description: 'Location information for the post',
    type: LocationDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty({
    description: 'Media IDs associated with this post',
    example: ['60f7b3b3b3b3b3b3b3b3b3b3', '60f7b3b3b3b3b3b3b3b3b3b4'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Media must be an array' })
  @IsString({ each: true, message: 'Each media ID must be a string' })
  media?: string[];
}

export class PostQueryDto {
  @ApiProperty({
    description: 'User ID to filter posts',
    example: '507f1f77bcf86cd799439011',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;

  @ApiProperty({
    description: 'Visibility filter',
    example: 'public',
    enum: ['public', 'private', 'friends', 'followers'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['public', 'private', 'friends', 'followers'], {
    message: 'Visibility must be one of: public, private, friends, followers',
  })
  visibility?: 'public' | 'private' | 'friends' | 'followers';

  @ApiProperty({
    description: 'Search term',
    example: 'adventure',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;

  @ApiProperty({
    description: 'Hashtag filter',
    example: 'travel',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Hashtag must be a string' })
  hashtag?: string;

  @ApiProperty({
    description: 'Location filter',
    example: 'Paris',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  location?: string;

  @ApiProperty({
    description: 'Sort by',
    example: 'recent',
    enum: ['recent', 'popular', 'trending', 'oldest'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['recent', 'popular', 'trending', 'oldest'], {
    message: 'Sort by must be one of: recent, popular, trending, oldest',
  })
  sortBy?: 'recent' | 'popular' | 'trending' | 'oldest';

  @ApiProperty({
    description: 'Page number',
    example: 1,
    type: Number,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const parsed = parseInt(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  @IsNumber({}, { message: 'Page must be a number' })
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    type: Number,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const parsed = parseInt(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  @IsNumber({}, { message: 'Limit must be a number' })
  limit?: number;

  @ApiProperty({
    description: 'Date from',
    example: '2024-01-01',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Date from must be a string' })
  dateFrom?: string;

  @ApiProperty({
    description: 'Date to',
    example: '2024-12-31',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Date to must be a string' })
  dateTo?: string;
}

export class PostDataDto {
  @ApiProperty({
    description: 'Unique post identifier',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  _id: string;

  @ApiProperty({
    description: 'Post title',
    example: 'My amazing journey today',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'Post description',
    example: 'Today was an incredible day...',
    type: String,
  })
  description: string;

  @ApiProperty({
    description: 'User who created the post',
    example: '507f1f77bcf86cd799439012',
    type: String,
  })
  userId: string;

  @ApiProperty({
    description: 'Post visibility',
    example: 'public',
    enum: ['public', 'private', 'friends', 'followers'],
  })
  visibility: string;

  @ApiProperty({
    description: 'Post creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
  })
  updatedAt: string;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'Operation success status',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Post retrieved successfully',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data?: any;

  @ApiProperty({
    description: 'Pagination metadata',
  })
  meta?: any;

  @ApiProperty({
    description: 'Error message',
    example: 'Post not found',
    type: String,
  })
  error?: string;
}
