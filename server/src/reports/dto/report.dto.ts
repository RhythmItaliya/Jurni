import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({
    description: 'Type of report (post or user)',
    example: 'post',
    enum: ['post', 'user'],
  })
  @IsEnum(['post', 'user'], {
    message: 'Report type must be either post or user',
  })
  @IsNotEmpty({ message: 'Report type is required' })
  reportType: 'post' | 'user';

  @ApiProperty({
    description:
      'MongoDB ObjectId or UUID of the reported content (post or user)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString({ message: 'Reported ID must be a string' })
  @Matches(
    /^[a-f\d]{24}$|^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    {
      message: 'Reported ID must be a valid MongoDB ObjectId or UUID',
    },
  )
  @IsNotEmpty({ message: 'Reported ID is required' })
  reportedId: string;

  @ApiProperty({
    description: 'Reason for the report',
    example: 'spam',
    enum: [
      'spam',
      'harassment',
      'inappropriate_content',
      'copyright_violation',
      'fake_account',
      'other',
    ],
  })
  @IsEnum(
    [
      'spam',
      'harassment',
      'inappropriate_content',
      'copyright_violation',
      'fake_account',
      'other',
    ],
    { message: 'Invalid report reason' },
  )
  @IsNotEmpty({ message: 'Report reason is required' })
  reason:
    | 'spam'
    | 'harassment'
    | 'inappropriate_content'
    | 'copyright_violation'
    | 'fake_account'
    | 'other';

  @ApiProperty({
    description: 'Additional details about the report',
    example: 'This post contains offensive content',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;
}

export class UpdateReportDto {
  @ApiProperty({
    description: 'Status of the report',
    example: 'reviewed',
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['pending', 'reviewed', 'resolved', 'dismissed'], {
    message: 'Invalid report status',
  })
  status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed';

  @ApiProperty({
    description: 'Review notes from admin',
    example: 'Content removed and user warned',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Review notes must be a string' })
  @MaxLength(1000, { message: 'Review notes cannot exceed 1000 characters' })
  reviewNotes?: string;
}
