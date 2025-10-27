import {
  IsString,
  IsOptional,
  IsMongoId,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a great post!',
    type: String,
  })
  @IsString({ message: 'Comment content must be a string' })
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  @MinLength(1, {
    message: 'Comment content must be at least 1 character long',
  })
  @MaxLength(1000, { message: 'Comment content cannot exceed 1000 characters' })
  content: string;

  @ApiPropertyOptional({
    description: 'ID of the parent comment (for replies)',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @IsOptional()
  @IsMongoId({ message: 'Parent comment ID must be a valid MongoDB ObjectId' })
  parentId?: string;
}

export class UpdateCommentDto {
  @ApiProperty({
    description: 'The updated content of the comment',
    example: 'This is an updated comment!',
    type: String,
  })
  @IsString({ message: 'Comment content must be a string' })
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  @MinLength(1, {
    message: 'Comment content must be at least 1 character long',
  })
  @MaxLength(1000, { message: 'Comment content cannot exceed 1000 characters' })
  content: string;
}

export class CommentQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    type: Number,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of comments per page',
    example: 10,
    type: Number,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by parent comment ID (for getting replies)',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @IsOptional()
  @IsMongoId({ message: 'Parent comment ID must be a valid MongoDB ObjectId' })
  parentId?: string;
}

export class CommentResponseDto {
  @ApiProperty({
    description: 'Comment ID',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'User who made the comment',
    type: Object,
  })
  userId: {
    _id: string;
    username: string;
  };

  @ApiProperty({
    description: 'Post ID this comment belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  postId: string;

  @ApiProperty({
    description: 'Comment content',
    example: 'This is a great post!',
  })
  content: string;

  @ApiPropertyOptional({
    description: 'Parent comment ID (for replies)',
    example: '507f1f77bcf86cd799439011',
  })
  parentId?: string;

  @ApiProperty({
    description: 'Comment status',
    example: 'active',
    enum: ['active', 'deleted'],
  })
  status: string;

  @ApiProperty({
    description: 'Number of likes on this comment',
    example: 5,
  })
  likesCount: number;

  @ApiProperty({
    description: 'Number of replies to this comment',
    example: 2,
  })
  repliesCount: number;

  @ApiProperty({
    description: 'Comment creation timestamp',
    example: '2023-10-27T10:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Comment last update timestamp',
    example: '2023-10-27T10:00:00.000Z',
  })
  updatedAt: string;
}
