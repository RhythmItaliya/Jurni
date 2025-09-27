import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService, OTPService, OTPCleanupService } from './services';
import { OTP, OTPSchema } from './models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }]),
    ScheduleModule.forRoot(),
  ],
  providers: [EmailService, OTPService, OTPCleanupService],
  exports: [EmailService, OTPService],
})
export class EmailModule {}
