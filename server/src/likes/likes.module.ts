import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeController } from './controllers/like.controller';
import { LikeService } from './services/like.service';
import { Like, LikeSchema } from './models/like.model';
import { PostsModule } from '@/posts/posts.module';
import { CommentsModule } from '@/comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    forwardRef(() => PostsModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikesModule {}
