import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { OTPService } from './otp.service';

@Module({
  providers: [EmailService, OTPService],
  exports: [EmailService, OTPService],
})
export class EmailModule {}
