import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 2200 })
  title: string;

  @Prop({ trim: true, maxlength: 5000 })
  description: string;

  @Prop({ type: [String], default: [] })
  hashtags: string[];

  @Prop({
    type: {
      name: { type: String, required: true },
      latitude: Number,
      longitude: Number,
      address: String,
    },
  })
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
    address?: string;
  };

  @Prop({ default: 'active' })
  status: 'active' | 'deleted' | 'archived' | 'draft';

  @Prop({ default: 'public' })
  visibility: 'public' | 'private' | 'friends' | 'followers';

  @Prop({ default: true })
  allowComments: boolean;

  @Prop({ default: true })
  allowLikes: boolean;

  @Prop({ default: true })
  allowShares: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Media' }], default: [] })
  media: Types.ObjectId[];

  // Timestamps (automatically managed by @Schema({ timestamps: true }))
  createdAt: Date;
  updatedAt: Date;

  // Version key (automatically managed by Mongoose)
  __v: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ hashtags: 1 });
PostSchema.index({ status: 1, visibility: 1 });
PostSchema.index({ title: 'text', description: 'text' });
