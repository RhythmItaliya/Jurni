import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @ApiProperty({
    description: 'Type of target to like',
    example: 'post',
    enum: ['post', 'comment'],
  })
  @IsEnum(['post', 'comment'], {
    message: 'Target type must be either post or comment',
  })
  targetType: 'post' | 'comment';

  @ApiProperty({
    description: 'ID of the target to like',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'Target ID is required' })
  targetId: string;
}

export class LikeResponseDto {
  @ApiProperty({
    description: 'Like ID',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'User who liked',
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
    description: 'Type of target liked',
    example: 'post',
    enum: ['post', 'comment'],
  })
  targetType: 'post' | 'comment';

  @ApiProperty({
    description: 'ID of the target liked',
    example: '507f1f77bcf86cd799439011',
  })
  targetId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-10-27T07:25:32.181Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-10-27T07:25:32.181Z',
  })
  updatedAt: string;
}

export class LikeStatsDto {
  @ApiProperty({
    description: 'Total number of likes',
    example: 42,
  })
  totalLikes: number;

  @ApiProperty({
    description: 'Whether current user has liked this target',
    example: true,
  })
  isLikedByUser: boolean;
}
