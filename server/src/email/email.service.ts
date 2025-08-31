import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ENV_VARS } from '@config/env';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: ENV_VARS.SMTP_HOST,
      port: ENV_VARS.SMTP_PORT,
      secure: ENV_VARS.SMTP_SECURE,
      auth: {
        user: ENV_VARS.SMTP_USER,
        pass: ENV_VARS.SMTP_PASS,
      },
    });
  }

  /**
   * Generate a random 6-character alphanumeric OTP
   * @returns 6-character OTP string (A-Z, 0-9)
   */
  private generateOTP(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
  }

  /**
   * Send registration verification email with 6-character OTP
   * @param email - User email address
   * @param username - User username
   * @returns 6-character OTP that was sent
   */
  async sendRegistrationOTP(email: string, username: string): Promise<string> {
    const otp = this.generateOTP();

    const mailOptions = {
      from: ENV_VARS.SMTP_FROM,
      to: email,
      subject: 'Verify Your Registration - OTP Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome ${username}!</h2>
          <p>Thank you for registering with us. To complete your registration, please use the following 6-character verification code:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f8f9fa; border: 2px solid #28a745; border-radius: 10px; padding: 20px; display: inline-block;">
              <h1 style="color: #28a745; font-size: 32px; margin: 0; letter-spacing: 5px; font-family: monospace; font-weight: bold;">${otp}</h1>
            </div>
          </div>
          <p><strong>Important:</strong></p>
          <ul>
            <li>This verification code will expire in 10 minutes</li>
            <li>Enter this code on the registration verification page</li>
            <li>If you didn't register, please ignore this email</li>
            <li>Do not share this code with anyone</li>
          </ul>
          <p>Best regards,<br>Your App Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return otp; // Return the OTP for storage/verification
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Test email connection
   * @returns Promise<boolean>
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      return false;
    }
  }
}
