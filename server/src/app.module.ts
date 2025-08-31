import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppModule as AppFeatureModule } from '@app/app.module';
import { UserModule } from '@users/user.module';
import { AuthModule } from '@auth/auth.module';
import { ENV_VARS } from '@config/env';

/**
 * Root application module
 * Imports all feature modules and configuration
 */
@Module({
  imports: [
    // Configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database connection module
    MongooseModule.forRoot(ENV_VARS.MONGODB_URI),

    // Feature modules
    AppFeatureModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
