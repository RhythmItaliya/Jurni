import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FollowDocument = Follow & Document;

@Schema({ timestamps: true })
export class Follow {
  @Prop({ required: true, ref: 'User' })
  follower: string; // UUID of the user who is following

  @Prop({ required: true, ref: 'User' })
  following: string; // UUID of the user being followed

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

// Create compound index to prevent duplicate follows
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });
