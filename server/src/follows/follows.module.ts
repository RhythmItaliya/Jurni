import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowController } from './controllers/follow.controller';
import { FollowService } from './services/follow.service';
import { Follow, FollowSchema } from './models/follow.model';
import { User, UserSchema } from '@users/models/user.schema';
import { Profile, ProfileSchema } from '../profiles/models/profile.model';
import { UserModule } from '@users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
    UserModule,
  ],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowsModule {}
