import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@users/user.module';
import { AuthModule } from '@auth/auth.module';
import { EmailModule } from '@/email/email.module';
import { UploadModule } from '@/upload/upload.module';
import { PostsModule } from '@/posts/posts.module';
import { ENV_VARS } from '@config/env';

/**
 * Main application module
 * Imports all feature modules, configuration, and provides basic app functionality
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
    UserModule,
    AuthModule,
    EmailModule,
    UploadModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
