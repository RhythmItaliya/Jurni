import { Injectable } from '@nestjs/common';

interface OTPData {
  otp: string;
  email: string;
  expiresAt: Date;
}

@Injectable()
export class OTPService {
  private otpStore: Map<string, OTPData> = new Map();

  /**
   * Store OTP for email verification
   * @param email - User email
   * @param otp - 6-digit OTP
   * @param expiryMinutes - OTP expiry time in minutes (default: 10)
   */
  storeOTP(email: string, otp: string, expiryMinutes: number = 10): void {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

    this.otpStore.set(email, {
      otp,
      email,
      expiresAt,
    });

    // Clean up expired OTPs
    this.cleanupExpiredOTPs();
  }

  /**
   * Verify OTP for email
   * @param email - User email
   * @param otp - 6-digit OTP to verify
   * @returns boolean - true if OTP is valid
   */
  verifyOTP(email: string, otp: string): boolean {
    const otpData = this.otpStore.get(email);

    if (!otpData) {
      return false;
    }

    // Check if OTP is expired
    if (new Date() > otpData.expiresAt) {
      this.otpStore.delete(email);
      return false;
    }

    // Check if OTP matches
    if (otpData.otp === otp) {
      // Remove OTP after successful verification
      this.otpStore.delete(email);
      return true;
    }

    return false;
  }

  /**
   * Get OTP data for email
   * @param email - User email
   * @returns OTPData or null
   */
  getOTPData(email: string): OTPData | null {
    const otpData = this.otpStore.get(email);

    if (!otpData) {
      return null;
    }

    // Check if OTP is expired
    if (new Date() > otpData.expiresAt) {
      this.otpStore.delete(email);
      return null;
    }

    return otpData;
  }

  /**
   * Remove OTP for email
   * @param email - User email
   */
  removeOTP(email: string): void {
    this.otpStore.delete(email);
  }

  /**
   * Clean up expired OTPs
   */
  private cleanupExpiredOTPs(): void {
    const now = new Date();

    for (const [email, otpData] of this.otpStore.entries()) {
      if (now > otpData.expiresAt) {
        this.otpStore.delete(email);
      }
    }
  }

  /**
   * Get OTP store size (for debugging)
   * @returns number of stored OTPs
   */
  getStoreSize(): number {
    return this.otpStore.size;
  }
}
