import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { PostMediaService } from './services/post-media.service';
import { Post, PostSchema } from './models/post.model';
import { UploadModule } from '@/upload/upload.module';
import { AuthModule } from '@/auth/auth.module';
import { CommentsModule } from '@/comments/comments.module';
import { LikesModule } from '@/likes/likes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UploadModule,
    AuthModule,
    forwardRef(() => CommentsModule),
    LikesModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostMediaService],
  exports: [PostService, PostMediaService],
})
export class PostsModule {}
