import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MediaDocument = Media & Document;

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ ref: 'Post', required: false })
  postId?: Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicUrl: string;

  @Prop({ required: true })
  bucket: string;

  @Prop({ required: true })
  mediaType: MediaType;

  @Prop()
  thumbnailUrl?: string;

  @Prop()
  size?: number;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.index({ userId: 1 });
MediaSchema.index({ postId: 1 });
MediaSchema.index({ mediaType: 1 });
