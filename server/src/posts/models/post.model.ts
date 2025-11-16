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
      place_id: Number,
      osm_type: String,
      osm_id: Number,
      class: String,
      type: String,
      place_rank: Number,
      importance: Number,
      addresstype: String,
      licence: String,
      address_details: {
        road: String,
        neighbourhood: String,
        city: String,
        county: String,
        state_district: String,
        state: String,
        ISO3166_2_lvl4: String,
        postcode: String,
        country: String,
        country_code: String,
      },
      boundingbox: [String],
    },
  })
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    place_id?: number;
    osm_type?: string;
    osm_id?: number;
    class?: string;
    type?: string;
    place_rank?: number;
    importance?: number;
    addresstype?: string;
    licence?: string;
    address_details?: {
      road?: string;
      neighbourhood?: string;
      city?: string;
      county?: string;
      state_district?: string;
      state?: string;
      ISO3166_2_lvl4?: string;
      postcode?: string;
      country?: string;
      country_code?: string;
      [key: string]: any;
    };
    boundingbox?: string[];
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

  @Prop({ default: true })
  allowSaves: boolean;

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
