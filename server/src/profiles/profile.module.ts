import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { Profile, ProfileSchema } from './models/profile.model';
import { UserModule } from '@users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    UserModule, // Import UserModule to access UserService
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
