import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP, OTPDocument } from '../models';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OTPService {
  constructor(@InjectModel(OTP.name) private otpModel: Model<OTPDocument>) {}

  /**
   * Store OTP in database
   * @param userUuid - User UUID
   * @param otp - 6-character OTP
   * @param expiryMinutes - OTP expiry time in minutes (default: 2 minutes)
   * @param type - OTP type (default: 'registration')
   * @returns Stored OTP document
   */
  async storeOTP(
    userUuid: string,
    otp: string,
    expiryMinutes: number = 2,
    type: string = 'registration',
  ): Promise<OTPDocument> {
    // Remove any existing OTPs for this user and type
    await this.otpModel.deleteMany({
      userUuid,
      type,
    });

    // Create new OTP
    const otpDoc = new this.otpModel({
      uuid: uuidv4(),
      userUuid,
      otp,
      type,
      expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
    });

    return await otpDoc.save();
  }

  /**
   * Verify OTP from database
   * @param userUuid - User UUID
   * @param otp - 6-character OTP to verify
   * @param type - OTP type (default: 'registration')
   * @returns True if OTP is valid and not expired
   */
  async verifyOTP(
    userUuid: string,
    otp: string,
    type: string = 'registration',
  ): Promise<boolean> {
    const otpDoc = await this.otpModel.findOne({
      userUuid,
      type,
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return false;
    }

    if (otpDoc.otp === otp) {
      // Delete OTP from database after successful verification
      await this.otpModel.deleteOne({ uuid: otpDoc.uuid });
      return true;
    }

    return false;
  }

  /**
   * Get OTP data for a user
   * @param userUuid - User UUID
   * @param type - OTP type (default: 'registration')
   * @returns OTP document or null
   */
  async getOTPData(
    userUuid: string,
    type: string = 'registration',
  ): Promise<OTPDocument | null> {
    return await this.otpModel.findOne({
      userUuid,
      type,
      expiresAt: { $gt: Date.now() },
    });
  }

  /**
   * Remove OTP from database
   * @param userUuid - User UUID
   * @param type - OTP type (default: 'registration')
   */
  async removeOTP(
    userUuid: string,
    type: string = 'registration',
  ): Promise<void> {
    await this.otpModel.deleteMany({
      userUuid,
      type,
    });
  }

  /**
   * Clean up expired OTPs (called by TTL index automatically)
   */
  async cleanupExpiredOTPs(): Promise<void> {
    await this.otpModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
  }

  /**
   * Clean up all OTPs for a specific user (when user is deleted)
   * @param userUuid - User UUID to clean up
   */
  async cleanupUserOTPs(userUuid: string): Promise<void> {
    await this.otpModel.deleteMany({
      userUuid,
    });
  }
}
