import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { PostMediaService } from './services/post-media.service';
import { Post, PostSchema } from './models/post.model';
import { Media, MediaSchema } from '@/media/models/media.model';
import { UploadModule } from '@/upload/upload.module';
import { AuthModule } from '@/auth/auth.module';
import { CommentsModule } from '@/comments/comments.module';
import { LikesModule } from '@/likes/likes.module';
import { SavePostsModule } from '@/saveposts/saveposts.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Media.name, schema: MediaSchema },
    ]),
    UploadModule,
    AuthModule,
    forwardRef(() => CommentsModule),
    forwardRef(() => LikesModule),
    forwardRef(() => SavePostsModule),
  ],
  controllers: [PostController],
  providers: [PostService, PostMediaService],
  exports: [PostService, PostMediaService],
})
export class PostsModule {}
