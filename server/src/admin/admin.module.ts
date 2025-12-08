import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ENV_VARS } from '@config/env';
import { Admin, AdminSchema } from './models';
import { User, UserSchema } from '@/users/models';
import {
  AdminService,
  AdminAuthService,
  AdminSeedService,
  AdminUsersService,
} from './services';
import {
  AdminAuthController,
  AdminController,
  AdminUsersController,
} from './controllers';
import { AdminJwtStrategy } from './strategies';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: ENV_VARS.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AdminAuthController, AdminController, AdminUsersController],
  providers: [
    AdminService,
    AdminAuthService,
    AdminSeedService,
    AdminUsersService,
    AdminJwtStrategy,
  ],
  exports: [AdminService, AdminAuthService, AdminUsersService],
})
export class AdminModule {}
