import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '@/auth/services/auth.service';
import {
  LoginDto,
  RegisterDto,
  RegistrationOTPDto,
  RegistrationResponseDto,
  ResendOTPDto,
  UpdateTempUserEmailDto,
  UpdateTempUserUsernameDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
} from '@/auth/dto/auth.dto';
import { ENDPOINTS } from '@/lib/endpoints';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register new user (temporary registration - user not created until OTP verification)
   * Endpoint: POST /auth/register
   * @param registerDto - Registration data
   * @returns Registration result with OTP sent
   */
  @Post(ENDPOINTS.AUTH.REGISTER)
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
   * Endpoint: POST /auth/login
   * @param loginDto - Login credentials
   * @returns Access token and user data
   */
  @Post(ENDPOINTS.AUTH.LOGIN)
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
   * Endpoint: POST /auth/verify-registration-otp
   * @param verifyOtpDto - OTP verification data
   * @returns Verification result with created user
   */
  @Post(ENDPOINTS.AUTH.VERIFY_REGISTRATION_OTP)
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
   * Endpoint: POST /auth/resend-registration-otp
   * @param email - User email address
   * @returns Resend result
   */
  @Post(ENDPOINTS.AUTH.RESEND_REGISTRATION_OTP)
  @ApiOperation({ summary: 'Resend registration OTP' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 429, description: 'Too many requests, please wait' })
  async resendRegistrationOTP(@Body() resendOtpDto: ResendOTPDto) {
    return this.authService.resendRegistrationOTP(resendOtpDto.email);
  }

  /**
   * Update temporary user email
   * Endpoint: POST /auth/update-temp-user-email
   * @param body - Current email and new email
   * @returns Update result
   */
  @Post(ENDPOINTS.AUTH.UPDATE_TEMP_USER_EMAIL)
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
   * Endpoint: POST /auth/update-temp-user-username
   * @param body - Email and new username
   * @returns Update result
   */
  @Post(ENDPOINTS.AUTH.UPDATE_TEMP_USER_USERNAME)
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

  /**
   * Request password reset
   * Endpoint: POST /auth/forgot-password
   * @param forgotPasswordDto - Email address for password reset
   * @returns Password reset result
   */
  @Post(ENDPOINTS.AUTH.FORGOT_PASSWORD)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset link sent if account exists',
    type: ForgotPasswordResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid email format' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  /**
   * Reset password with token
   * Endpoint: POST /auth/reset-password
   * @param resetPasswordDto - Reset token and new password
   * @returns Password reset result
   */
  @Post(ENDPOINTS.AUTH.RESET_PASSWORD)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or password requirements',
  })
  @ApiResponse({ status: 404, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }

  /**
   * Verify reset token
   * Endpoint: POST /auth/verify-reset-token
   * @param token - Reset token to verify
   * @returns Token verification result
   */
  @Post(ENDPOINTS.AUTH.VERIFY_RESET_TOKEN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify password reset token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 404, description: 'Invalid or expired token' })
  async verifyResetToken(@Body() { token }: { token: string }) {
    return this.authService.verifyResetToken(token);
  }
}
