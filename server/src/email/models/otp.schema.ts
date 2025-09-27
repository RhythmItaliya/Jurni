import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OTPDocument = OTP & Document;

@Schema({ timestamps: true })
export class OTP {
  @ApiProperty({
    description: 'OTP UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Prop({ required: true, unique: true })
  uuid: string;

  @ApiProperty({
    description: 'User UUID reference',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Prop({ required: true, type: String })
  userUuid: string;

  @ApiProperty({
    description: '6-character OTP code',
    example: 'A1B2C3',
    type: String,
  })
  @Prop({ required: true })
  otp: string;

  @ApiProperty({
    description: 'OTP type (registration, password-reset, etc.)',
    example: 'registration',
    type: String,
  })
  @Prop({ required: true, default: 'registration' })
  type: string;

  @ApiProperty({
    description: 'OTP expiry timestamp',
    example: '2024-01-01T00:02:00.000Z',
    type: Date,
  })
  @Prop({ required: true })
  expiresAt: Date;

  @ApiProperty({
    description: 'OTP creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty({
    description: 'OTP last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);

// Index for faster queries
OTPSchema.index({ userUuid: 1, type: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
