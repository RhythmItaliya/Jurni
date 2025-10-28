import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['post', 'comment'] })
  targetType: 'post' | 'comment';

  @Prop({ required: true, refPath: 'targetType' })
  targetId: Types.ObjectId;

  // Timestamps (automatically managed by @Schema({ timestamps: true }))
  createdAt?: Date;
  updatedAt?: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Add indexes for better performance
LikeSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
LikeSchema.index({ targetType: 1, targetId: 1 });
