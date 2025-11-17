import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowController } from './controllers/follow.controller';
import { FollowService } from './services/follow.service';
import { Follow, FollowSchema } from './models/follow.model';
import { User, UserSchema } from '@users/models/user.schema';
import { UserModule } from '@users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
  ],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowsModule {}
