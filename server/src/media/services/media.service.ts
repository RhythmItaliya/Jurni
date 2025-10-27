import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Media, MediaDocument, MediaType } from '@/media/models/media.model';
import { CreateMediaDto } from '@/media/dto';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
  ) {}

  async create(mediaData: CreateMediaDto & { userId: string }) {
    const doc = new this.mediaModel({
      ...mediaData,
      userId: new Types.ObjectId(mediaData.userId),
      postId: mediaData.postId
        ? new Types.ObjectId(mediaData.postId as any)
        : undefined,
    });
    return await doc.save();
  }

  async findByPost(postId: string) {
    return this.mediaModel.find({ postId: new Types.ObjectId(postId) }).exec();
  }

  async findByUser(userId: string) {
    return this.mediaModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }
}
