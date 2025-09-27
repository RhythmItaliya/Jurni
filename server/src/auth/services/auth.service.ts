import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@users/services';
import { LoginDto, RegisterDto, RegistrationOTPDto } from '../dto/auth.dto';
import { EmailService, OTPService } from '@/email/services';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private otpService: OTPService,
  ) {}

  /**
   * Validate user credentials
   * @param usernameOrEmail - Username or email
   * @param password - User password
   * @returns User object without password or null
   */
  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.userService.findByUsernameOrEmail(usernameOrEmail);
    if (
      user &&
      (await this.userService.comparePassword(password, user.password))
    ) {
      const { password: _, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  /**
   * Login user (only active users can login)
   * @param loginDto - Login credentials
   * @returns Access token and user data
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(
      loginDto.usernameOrEmail,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username/email or password');
    }

    // Only allow active users to login
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account is not verified. Please complete your registration first.',
      );
    }

    const payload = { email: user.email, sub: user.uuid };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        otpVerifiedAt: user.otpVerifiedAt?.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Register new user (temporary registration - user not saved to database until OTP verification)
   * @param registerDto - Registration data
   * @returns Registration result with OTP sent
   */
  async register(registerDto: RegisterDto) {
    // Create or update temporary user (this will check for duplicates and handle updates)
    const tempUser = await this.userService.upsertTempUser(registerDto);

    // Send OTP email
    const otp = await this.emailService.sendRegistrationOTP(
      tempUser.email,
      tempUser.username,
    );

    // Store OTP in database with 2-minute expiry
    await this.otpService.storeOTP(tempUser.uuid, otp, 2, 'registration');

    return {
      message:
        'Registration successful! Please check your email for verification OTP.',
      user: {
        uuid: tempUser.uuid,
        username: tempUser.username,
        email: tempUser.email,
        isActive: false,
        otpVerifiedAt: null,
        createdAt: tempUser.createdAt.toISOString(),
        updatedAt: tempUser.updatedAt.toISOString(),
      },
      otpInfo: {
        expiresIn: '2 minutes',
        type: 'registration',
      },
    };
  }

  /**
   * Verify registration OTP and create user account
   * @param verifyOtpDto - OTP verification data
   * @returns Verification result
   */
  async verifyRegistrationOTP(verifyOtpDto: RegistrationOTPDto) {
    // Find temporary user by email
    const tempUser = await this.userService.findTempUserByEmail(
      verifyOtpDto.email,
    );
    if (!tempUser) {
      throw new NotFoundException(
        'Registration data not found. Please register again.',
      );
    }

    // Verify OTP from database
    const isValid = await this.otpService.verifyOTP(
      tempUser.uuid,
      verifyOtpDto.otp,
      'registration',
    );

    if (!isValid) {
      throw new BadRequestException(
        'Invalid or expired OTP. Please request a new one.',
      );
    }

    try {
      // Move temporary user to main users table (only after successful OTP verification)
      const user = await this.userService.moveTempUserToMain(
        verifyOtpDto.email,
      );

      return {
        message:
          'Registration verified successfully! Your account has been created. You can now login.',
        email: verifyOtpDto.email,
        otpVerifiedAt: user.otpVerifiedAt?.toISOString(),
        user: {
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          isActive: user.isActive,
          otpVerifiedAt: user.otpVerifiedAt?.toISOString(),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(
          'User already exists. Please login instead.',
        );
      }
      throw new BadRequestException(
        'Failed to create account. Please try again.',
      );
    }
  }

  /**
   * Resend registration OTP
   * @param email - User email address
   * @returns Resend result
   */
  async resendRegistrationOTP(email: string) {
    // Find temporary user by email
    const tempUser = await this.userService.findTempUserByEmail(email);
    if (!tempUser) {
      throw new NotFoundException(
        'Registration not found. Please register again.',
      );
    }

    // Generate and send new OTP (no limits)
    const otp = await this.emailService.sendRegistrationOTP(
      tempUser.email,
      tempUser.username,
    );

    // Store new OTP in database with 2-minute expiry
    await this.otpService.storeOTP(tempUser.uuid, otp, 2, 'registration');

    return {
      message: 'New OTP sent successfully! Please check your email.',
      email: tempUser.email,
      username: tempUser.username,
      otpInfo: {
        expiresIn: '2 minutes',
        type: 'registration',
      },
    };
  }

  /**
   * Update temporary user email
   * @param currentEmail - Current email address
   * @param newEmail - New email address
   * @returns Update result
   */
  async updateTempUserEmail(currentEmail: string, newEmail: string) {
    const updatedTempUser = await this.userService.updateTempUser(
      currentEmail,
      { email: newEmail },
    );

    return {
      message:
        'Email updated successfully! Please check your new email for verification OTP.',
      user: {
        uuid: updatedTempUser.uuid,
        username: updatedTempUser.username,
        email: updatedTempUser.email,
        isActive: false,
        otpVerifiedAt: null,
        createdAt: updatedTempUser.createdAt.toISOString(),
        updatedAt: updatedTempUser.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Update temporary user username
   * @param email - User email address
   * @param newUsername - New username
   * @returns Update result
   */
  async updateTempUserUsername(email: string, newUsername: string) {
    const updatedTempUser = await this.userService.updateTempUser(email, {
      username: newUsername,
    });

    return {
      message: 'Username updated successfully!',
      user: {
        uuid: updatedTempUser.uuid,
        username: updatedTempUser.username,
        email: updatedTempUser.email,
        isActive: false,
        otpVerifiedAt: null,
        createdAt: updatedTempUser.createdAt.toISOString(),
        updatedAt: updatedTempUser.updatedAt.toISOString(),
      },
    };
  }
}
