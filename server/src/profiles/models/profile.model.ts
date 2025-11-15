import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'User website URL',
    example: 'https://johndoe.com',
    type: String,
    required: false,
  })
  @Prop({ required: false })
  website?: string;

  @ApiProperty({
    description: 'User location',
    example: 'San Francisco, CA',
    type: String,
    required: false,
  })
  @Prop({ required: false })
  location?: string;

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
