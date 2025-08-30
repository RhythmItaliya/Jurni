import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
