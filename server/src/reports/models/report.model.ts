import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ReportDocument = Report & Document;

export type ReportType = 'post' | 'user';
export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'inappropriate_content'
  | 'copyright_violation'
  | 'fake_account'
  | 'other';

@Schema({ timestamps: true })
export class Report {
  @ApiProperty({
    description: 'Report UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Prop({ required: true, unique: true })
  uuid: string;

  @ApiProperty({
    description: 'User who submitted the report',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @Prop({ required: true, ref: 'User' })
  reporterId: Types.ObjectId;

  @ApiProperty({
    description: 'Type of report (post or user)',
    example: 'post',
    enum: ['post', 'user'],
  })
  @Prop({ required: true, enum: ['post', 'user'] })
  reportType: ReportType;

  @ApiProperty({
    description: 'ID of the reported content (post or user)',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @Prop({ required: true })
  reportedId: Types.ObjectId;

  @ApiProperty({
    description: 'Reason for the report',
    example: 'spam',
    enum: [
      'spam',
      'harassment',
      'inappropriate_content',
      'copyright_violation',
      'fake_account',
      'other',
    ],
  })
  @Prop({
    required: true,
    enum: [
      'spam',
      'harassment',
      'inappropriate_content',
      'copyright_violation',
      'fake_account',
      'other',
    ],
  })
  reason: ReportReason;

  @ApiProperty({
    description: 'Additional details about the report',
    example: 'This post contains offensive content',
    type: String,
    required: false,
  })
  @Prop({ trim: true, maxlength: 1000 })
  description?: string;

  @ApiProperty({
    description: 'Status of the report',
    example: 'pending',
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
  })
  @Prop({
    default: 'pending',
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
  })
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';

  @ApiProperty({
    description: 'Admin who reviewed the report',
    example: '507f1f77bcf86cd799439011',
    type: String,
    required: false,
  })
  @Prop({ ref: 'Admin' })
  reviewedBy?: Types.ObjectId;

  @ApiProperty({
    description: 'Review notes from admin',
    example: 'Content removed and user warned',
    type: String,
    required: false,
  })
  @Prop({ trim: true, maxlength: 1000 })
  reviewNotes?: string;

  @ApiProperty({
    description: 'Date when the report was reviewed',
    type: Date,
    required: false,
  })
  @Prop()
  reviewedAt?: Date;

  // Timestamps (automatically managed by @Schema({ timestamps: true }))
  createdAt: Date;
  updatedAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
