import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Application module
 * Provides basic app functionality and endpoints
 */
@Module({
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
