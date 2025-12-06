import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { Profile, ProfileSchema } from './models/profile.model';
import { User, UserSchema } from '@users/models/user.schema';
import { Post, PostSchema } from '@/posts/models/post.model';
import { Like, LikeSchema } from '@/likes/models/like.model';
import { SavePost, SavePostSchema } from '@/saveposts/models/savepost.model';
import { Follow, FollowSchema } from '@/follows/models/follow.model';
import { UserModule } from '@users/user.module';
import { UploadModule } from '@/upload/upload.module';
import { FollowsModule } from '@/follows/follows.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: SavePost.name, schema: SavePostSchema },
      { name: Follow.name, schema: FollowSchema },
    ]),
    UserModule,
    UploadModule,
    FollowsModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
