import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { Profile, ProfileSchema } from './models/profile.model';
import { User, UserSchema } from '@users/models/user.schema';
import { UserModule } from '@users/user.module';
import { UploadModule } from '@/upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule, // Import UserModule to access UserService
    UploadModule, // Import UploadModule for file uploads
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
