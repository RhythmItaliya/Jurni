import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RegistrationOTPDto } from '@users/dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register new user
   * @param registerDto - Registration data
   * @returns Registration result with OTP sent
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered, OTP sent to email',
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Login user
   * @param loginDto - Login credentials
   * @returns Access token and user data
   */
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 201, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Verify registration OTP
   * @param verifyOtpDto - OTP verification data
   * @returns Verification result
   */
  @Post('verify-registration-otp')
  @ApiOperation({ summary: 'Verify registration OTP' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async verifyRegistrationOTP(@Body() verifyOtpDto: RegistrationOTPDto) {
    return this.authService.verifyRegistrationOTP(verifyOtpDto);
  }
}
