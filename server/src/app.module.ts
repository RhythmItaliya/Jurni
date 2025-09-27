import { Module } from '@nestjs/common';
import { AppModule as AppFeatureModule } from '@app/app.module';

/**
 * Root application module
 * Imports the main app feature module
 */
@Module({
  imports: [AppFeatureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
