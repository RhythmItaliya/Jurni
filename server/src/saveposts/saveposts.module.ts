import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavePostController } from './controllers/savepost.controller';
import { SavePostService } from './services/savepost.service';
import { SavePost, SavePostSchema } from './models/savepost.model';
import { PostsModule } from '@/posts/posts.module';
import { Media, MediaSchema } from '@/media/models/media.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavePost.name, schema: SavePostSchema },
      { name: Media.name, schema: MediaSchema },
    ]),
    forwardRef(() => PostsModule),
  ],
  controllers: [SavePostController],
  providers: [SavePostService],
  exports: [SavePostService],
})
export class SavePostsModule {}
