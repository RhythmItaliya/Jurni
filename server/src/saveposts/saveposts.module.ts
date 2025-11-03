import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavePostController } from './controllers/savepost.controller';
import { SavePostService } from './services/savepost.service';
import { SavePost, SavePostSchema } from './models/savepost.model';
import { PostsModule } from '@/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavePost.name, schema: SavePostSchema },
    ]),
    forwardRef(() => PostsModule),
  ],
  controllers: [SavePostController],
  providers: [SavePostService],
  exports: [SavePostService],
})
export class SavePostsModule {}
