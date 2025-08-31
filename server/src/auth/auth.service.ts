import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@users/user.service';
import { LoginDto, RegisterDto, RegistrationOTPDto } from '@users/dto/auth.dto';
import { EmailService } from '@/email/email.service';
import { OTPService } from '@/email/otp.service';

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
   * Login user
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

    // Check if user account is active
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account is inactive. Please verify your email first.',
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
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Register new user
   * @param registerDto - Registration data
   * @returns Registration result with OTP sent
   */
  async register(registerDto: RegisterDto) {
    // Create user (this will check for duplicates)
    const user = await this.userService.register(registerDto);

    // Send OTP email
    const otp = await this.emailService.sendRegistrationOTP(
      user.email,
      user.username,
    );

    // Store OTP for verification
    this.otpService.storeOTP(user.email, otp, 10); // 10 minutes expiry

    return {
      message:
        'Registration successful! Please check your email for verification OTP.',
      email: user.email,
      username: user.username,
    };
  }

  /**
   * Verify registration OTP
   * @param verifyOtpDto - OTP verification data
   * @returns Verification result
   */
  async verifyRegistrationOTP(verifyOtpDto: RegistrationOTPDto) {
    // Verify OTP
    const isValid = this.otpService.verifyOTP(
      verifyOtpDto.email,
      verifyOtpDto.otp,
    );

    if (!isValid) {
      throw new BadRequestException(
        'Invalid or expired OTP. Please request a new one.',
      );
    }

    try {
      // Activate user account
      await this.userService.activateUser(verifyOtpDto.email);

      return {
        message: 'Registration verified successfully! You can now login.',
        email: verifyOtpDto.email,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found. Please register again.');
      }
      throw new BadRequestException(
        'Failed to activate account. Please try again.',
      );
    }
  }
}
