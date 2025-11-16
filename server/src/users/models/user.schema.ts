import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Prop({ required: true, unique: true })
  uuid: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
    type: String,
  })
  @Prop({ required: true, unique: true })
  username: string;

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
  @Prop({
    type: Object,
    required: false,
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

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    type: String,
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'Hashed password',
    example: '$2a$10$hashedpasswordstring',
    type: String,
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'User active status',
    example: true,
    type: Boolean,
    default: false,
  })
  @Prop({ default: false })
  isActive: boolean;

  @ApiProperty({
    description: 'OTP verification timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
    required: false,
  })
  @Prop({ required: false })
  otpVerifiedAt?: Date;

  @ApiProperty({
    description: 'Password reset token',
    example: 'abc123def456ghi789',
    type: String,
    required: false,
  })
  @Prop({ required: false })
  resetToken?: string;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
