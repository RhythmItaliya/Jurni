import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AdminDocument = Admin &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Admin {
  @ApiProperty({
    description: 'Admin UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Prop({ required: true, unique: true })
  uuid: string;

  @ApiProperty({
    description: 'Admin username',
    example: 'admin',
    type: String,
  })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@jurni.com',
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
    description: 'Admin role',
    example: 'super_admin',
    enum: ['super_admin', 'admin'],
    type: String,
  })
  @Prop({
    required: true,
    enum: ['super_admin', 'admin'],
    default: 'admin',
  })
  role: string;

  @ApiProperty({
    description: 'Admin active status',
    example: true,
    type: Boolean,
    default: true,
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Admin permissions',
    example: ['users.read', 'posts.read', 'posts.delete'],
    type: [String],
  })
  @Prop({ type: [String], default: [] })
  permissions: string[];

  @ApiProperty({
    description: 'Last login timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
    required: false,
  })
  @Prop({ required: false })
  lastLoginAt?: Date;

  @ApiProperty({
    description: 'Password reset token',
    example: 'abc123def456ghi789',
    type: String,
    required: false,
  })
  @Prop({ required: false })
  resetToken?: string;

  @ApiProperty({
    description: 'Reset token expiry',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
    required: false,
  })
  @Prop({ required: false })
  resetTokenExpiry?: Date;

  @ApiProperty({
    description: 'Admin creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Admin last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
