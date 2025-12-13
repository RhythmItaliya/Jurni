import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/users/models';
import { Post, PostSchema } from '@/posts/models/post.model';
import { Follow, FollowSchema } from '@/follows/models/follow.model';
import { Profile, ProfileSchema } from '@/profiles/models/profile.model';
import { SuggestionsController } from './controllers/suggestions.controller';
import { SuggestionsService } from './services/suggestions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Follow.name, schema: FollowSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}
