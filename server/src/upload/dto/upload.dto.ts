import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    description: 'File description (optional)',
    example: 'My vacation photo from the beach',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}

export class DeleteFileDto {
  @ApiProperty({
    description: 'File key to delete from storage',
    example: 'uploads/user123/image_1642435200000.jpg',
    type: String,
  })
  @IsString({ message: 'Key must be a string' })
  key: string;
}

export class UploadResponseDto {
  @ApiProperty({
    description: 'Operation success status',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'File uploaded successfully',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Response data (optional)',
  })
  data?: unknown;

  @ApiProperty({
    description: 'Error message (optional)',
    example: 'File upload failed',
    type: String,
  })
  error?: string;
}
