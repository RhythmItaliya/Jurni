import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, ref: 'Post' })
  postId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 1000 })
  content: string;

  @Prop({ ref: 'Comment' })
  parentId?: Types.ObjectId; // For nested replies

  @Prop({ default: 'active' })
  status: 'active' | 'deleted';

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[]; // Users who liked this comment

  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  repliesCount: number;

  // Timestamps (automatically managed by @Schema({ timestamps: true }))
  createdAt?: Date;
  updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Add indexes for better performance
CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });
CommentSchema.index({ userId: 1 });
