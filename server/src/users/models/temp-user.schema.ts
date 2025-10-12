import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TempUserDocument = TempUser & Document;

@Schema({ timestamps: true })
export class TempUser {
  @ApiProperty({
    description: 'Temporary user UUID',
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
    description: 'Temporary user creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Temporary user last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;
}

export const TempUserSchema = SchemaFactory.createForClass(TempUser);

// Index for faster queries
TempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // TTL index - auto delete after 1 hour
