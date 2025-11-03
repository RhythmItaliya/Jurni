import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SavePostDocument = SavePost & Document;

@Schema({ timestamps: true })
export class SavePost {
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, ref: 'Post' })
  postId: Types.ObjectId;

  // Timestamps (automatically managed by @Schema({ timestamps: true }))
  createdAt?: Date;
  updatedAt?: Date;
}

export const SavePostSchema = SchemaFactory.createForClass(SavePost);

// Add indexes for better performance
SavePostSchema.index({ userId: 1, postId: 1 }, { unique: true });
SavePostSchema.index({ postId: 1 });
