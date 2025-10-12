import { IsString, IsOptional, IsEnum, IsUrl, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../models/media.model';

export class CreateMediaDto {
  @ApiProperty({
    description: 'Media file key in storage',
    example: 'uploads/user123/image_1642435200000.jpg',
    type: String,
  })
  @IsString({ message: 'Key must be a string' })
  key: string;

  @ApiProperty({
    description: 'Media file URL',
    example: 'https://cdn.example.com/uploads/user123/image_1642435200000.jpg',
    type: String,
  })
  @IsUrl({}, { message: 'URL must be a valid URL' })
  url: string;

  @ApiProperty({
    description: 'Public media file URL',
    example: 'https://cdn.example.com/uploads/user123/image_1642435200000.jpg',
    type: String,
  })
  @IsUrl({}, { message: 'Public URL must be a valid URL' })
  publicUrl: string;

  @ApiProperty({
    description: 'Storage bucket name',
    example: 'my-app-bucket',
    type: String,
  })
  @IsString({ message: 'Bucket must be a string' })
  bucket: string;

  @ApiProperty({
    description: 'Media type',
    example: 'image',
    enum: MediaType,
  })
  @IsEnum(MediaType, {
    message: 'Media type must be one of: image, video, audio, other',
  })
  mediaType: MediaType;

  @ApiProperty({
    description: 'Thumbnail URL (optional)',
    example: 'https://cdn.example.com/thumbs/user123/thumb_1642435200000.jpg',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Thumbnail URL must be a valid URL' })
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'File size in bytes (optional)',
    example: 1024000,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Size must be a number' })
  size?: number;

  @ApiProperty({
    description: 'Associated post ID (optional)',
    example: '507f1f77bcf86cd799439011',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Post ID must be a string' })
  postId?: string;
}

export class MediaResponseDto {
  @ApiProperty({
    description: 'Unique media identifier',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  _id: string;

  @ApiProperty({
    description: 'User who owns the media',
    example: '507f1f77bcf86cd799439012',
    type: String,
  })
  userId: string;

  @ApiProperty({
    description: 'Associated post ID',
    example: '507f1f77bcf86cd799439013',
    type: String,
  })
  postId: string;

  @ApiProperty({
    description: 'Media file key in storage',
    example: 'uploads/user123/image_1642435200000.jpg',
    type: String,
  })
  key: string;

  @ApiProperty({
    description: 'Media file URL',
    example: 'https://cdn.example.com/uploads/user123/image_1642435200000.jpg',
    type: String,
  })
  url: string;

  @ApiProperty({
    description: 'Public media file URL',
    example: 'https://cdn.example.com/uploads/user123/image_1642435200000.jpg',
    type: String,
  })
  publicUrl: string;

  @ApiProperty({
    description: 'Storage bucket name',
    example: 'my-app-bucket',
    type: String,
  })
  bucket: string;

  @ApiProperty({
    description: 'Media type',
    example: 'image',
    enum: MediaType,
  })
  mediaType: MediaType;

  @ApiProperty({
    description: 'Media creation timestamp',
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
