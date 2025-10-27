import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { Comment, CommentSchema } from './models/comment.model';
import { PostsModule } from '@/posts/posts.module';
import { UserModule } from '@/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    forwardRef(() => PostsModule), // Import PostsModule to access PostService
    UserModule, // Import UserModule for User model population
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentsModule {}
