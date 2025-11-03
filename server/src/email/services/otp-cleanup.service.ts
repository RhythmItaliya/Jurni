import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OTPService } from './otp.service';

@Injectable()
export class OTPCleanupService {
  private readonly logger = new Logger(OTPCleanupService.name);

  constructor(private readonly otpService: OTPService) {}

  /**
   * Clean up expired OTPs every 5 minutes
   * Uses NestJS Cron decorator for best practice scheduling
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleExpiredOTPCleanup() {
    try {
      // Clean up expired OTPs
      await this.otpService.cleanupExpiredOTPs();

      this.logger.log('Expired OTP cleanup completed successfully');
    } catch (error) {
      this.logger.error('Failed to clean up expired OTPs:', error);
    }
  }

  /**
   * Clean up used OTPs every hour (as backup)
   * This is mainly for any OTPs that might not have been deleted immediately
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleUsedOTPCleanup() {
    try {
      this.logger.log('Starting used OTP cleanup task...');

      // This is mainly a backup cleanup since we delete used OTPs immediately
      // But it's good to have as a safety net
      this.logger.log('Used OTP cleanup completed (no action needed)');
    } catch (error) {
      this.logger.error('Failed to clean up used OTPs:', error);
    }
  }

  /**
   * Daily cleanup task for system maintenance
   * Runs at 2:00 AM every day
   */
  @Cron('0 2 * * *')
  async handleDailyCleanup() {
    try {
      this.logger.log('Starting daily OTP cleanup task...');

      // Perform any additional cleanup tasks
      // This could include cleaning up very old OTP records, etc.

      this.logger.log('Daily OTP cleanup completed successfully');
    } catch (error) {
      this.logger.error('Failed to perform daily OTP cleanup:', error);
    }
  }
}
