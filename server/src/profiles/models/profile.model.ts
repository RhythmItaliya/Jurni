import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import type { LocationData } from '@/types/location.types';

export type ProfileDocument = Profile &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Profile {
  @ApiProperty({
    description: 'Reference to the user',
    type: String,
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: String,
    required: false,
  })
  @Prop({ required: false })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: String,
    required: false,
  })
  @Prop({ required: false })
  lastName?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Software developer passionate about creating amazing apps',
    type: String,
    required: false,
  })
  @Prop({ required: false })
  bio?: string;

  @ApiProperty({
    description: 'User cover image media object',
    required: false,
    example: {
      key: 'profiles/covers/image/2025/11/16/user-123/cover.jpg',
      url: 'https://r2-url.com/cover.jpg',
      publicUrl: 'https://pub-r2-url.com/cover.jpg',
      bucket: 'jurni-bucket',
      size: 1024000,
      contentType: 'image/jpeg',
      mediaId: '507f1f77bcf86cd799439011',
    },
  })
  @Prop({
    type: Object,
    required: false,
  })
  coverImage?: {
    key: string;
    url: string;
    publicUrl: string;
    bucket: string;
    size?: number;
    contentType?: string;
    mediaId?: string;
  };

  @ApiProperty({
    description: 'User location with detailed Nominatim data',
    required: false,
  })
  @Prop({
    type: Object,
    default: null,
  })
  location?: LocationData;

  @ApiProperty({
    description: 'Is profile private',
    example: false,
    type: Boolean,
    default: false,
  })
  @Prop({ default: false })
  isPrivate: boolean;

  @ApiProperty({
    description: 'Profile creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Profile last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
