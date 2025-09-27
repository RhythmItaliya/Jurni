import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import {
  LoginDto,
  RegisterDto,
  RegistrationOTPDto,
  RegistrationResponseDto,
  ResendOTPDto,
  UpdateTempUserEmailDto,
  UpdateTempUserUsernameDto,
} from '../dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register new user (temporary registration - user not created until OTP verification)
   * @param registerDto - Registration data
   * @returns Registration result with OTP sent
   */
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate user registration (temporary)' })
  @ApiResponse({
    status: 200,
    description: 'Registration initiated, OTP sent to email',
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Login user (only active/verified users can login)
   * @param loginDto - Login credentials
   * @returns Access token and user data
   */
  @Post('login')
  @ApiOperation({ summary: 'Login user (verified accounts only)' })
  @ApiResponse({ status: 201, description: 'Login successful' })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or unverified account',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Verify registration OTP and create user account
   * @param verifyOtpDto - OTP verification data
   * @returns Verification result with created user
   */
  @Post('verify-registration-otp')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Verify registration OTP and create user account' })
  @ApiResponse({
    status: 201,
    description: 'OTP verified successfully, user account created',
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  @ApiResponse({ status: 404, description: 'Registration data not found' })
  async verifyRegistrationOTP(@Body() verifyOtpDto: RegistrationOTPDto) {
    return this.authService.verifyRegistrationOTP(verifyOtpDto);
  }

  /**
   * Resend registration OTP
   * @param email - User email address
   * @returns Resend result
   */
  @Post('resend-registration-otp')
  @ApiOperation({ summary: 'Resend registration OTP' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 429, description: 'Too many requests, please wait' })
  async resendRegistrationOTP(@Body() resendOtpDto: ResendOTPDto) {
    return this.authService.resendRegistrationOTP(resendOtpDto.email);
  }

  /**
   * Update temporary user email
   * @param body - Current email and new email
   * @returns Update result
   */
  @Post('update-temp-user-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update temporary user email' })
  @ApiResponse({ status: 200, description: 'Email updated successfully' })
  @ApiResponse({ status: 404, description: 'Temporary user not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async updateTempUserEmail(@Body() updateEmailDto: UpdateTempUserEmailDto) {
    return this.authService.updateTempUserEmail(
      updateEmailDto.currentEmail,
      updateEmailDto.newEmail,
    );
  }

  /**
   * Update temporary user username
   * @param body - Email and new username
   * @returns Update result
   */
  @Post('update-temp-user-username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update temporary user username' })
  @ApiResponse({ status: 200, description: 'Username updated successfully' })
  @ApiResponse({ status: 404, description: 'Temporary user not found' })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async updateTempUserUsername(
    @Body() updateUsernameDto: UpdateTempUserUsernameDto,
  ) {
    return this.authService.updateTempUserUsername(
      updateUsernameDto.email,
      updateUsernameDto.newUsername,
    );
  }
}
