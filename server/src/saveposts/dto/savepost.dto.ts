import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSavePostDto {
  @ApiProperty({
    description: 'ID of the post to save',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'Post ID is required' })
  postId: string;
}

export class SavePostResponseDto {
  @ApiProperty({
    description: 'SavePost ID',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'User who saved the post',
    example: {
      _id: '507f1f77bcf86cd799439011',
      username: 'johndoe',
    },
  })
  userId: {
    _id: string;
    username: string;
  };

  @ApiProperty({
    description: 'ID of the saved post',
    example: '507f1f77bcf86cd799439011',
  })
  postId: string;

  @ApiProperty({
    description: 'Timestamp when the post was saved',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the save was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class SavePostStatsDto {
  @ApiProperty({
    description: 'Total number of saves for the post',
    example: 42,
  })
  totalSaves: number;

  @ApiProperty({
    description: 'Whether the current user has saved this post',
    example: true,
  })
  isSavedByUser: boolean;
}
