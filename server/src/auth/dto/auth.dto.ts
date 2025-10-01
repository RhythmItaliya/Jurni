import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email address',
    example: 'johndoe or john@example.com',
    type: String,
  })
  @IsString({ message: 'Username or email must be a string' })
  @IsNotEmpty({ message: 'Username or email is required' })
  usernameOrEmail: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description:
      'Username (minimum 3 characters, letters, numbers, underscores only)',
    example: 'johndoe',
    type: String,
    minLength: 3,
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({
    description: 'User email address (must be valid email format)',
    example: 'john@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class RegistrationOTPDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: '6-character OTP received via email (A-Z, 0-9)',
    example: 'A1B2C3',
    type: String,
    minLength: 6,
    maxLength: 6,
  })
  @IsString({ message: 'OTP must be a string' })
  @IsNotEmpty({ message: 'OTP is required' })
  @MinLength(6, { message: 'OTP must be exactly 6 characters' })
  @MaxLength(6, { message: 'OTP must be exactly 6 characters' })
  @Matches(/^[A-Z0-9]{6}$/, {
    message: 'OTP must be exactly 6 characters (A-Z, 0-9)',
  })
  otp: string;
}

export class RegistrationResponseDto {
  @ApiProperty({
    description: 'Success message',
    example:
      'Registration successful! Please check your email for verification OTP.',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      uuid: {
        type: 'string',
        description: 'Unique user identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      username: {
        type: 'string',
        description: 'User username',
        example: 'johndoe',
      },
      email: {
        type: 'string',
        description: 'User email address',
        example: 'john@example.com',
      },
      isActive: {
        type: 'boolean',
        description: 'User account active status',
        example: false,
      },
      createdAt: {
        type: 'string',
        description: 'Account creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
      },
      updatedAt: {
        type: 'string',
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  user: {
    uuid: string;
    username: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };

  @ApiProperty({
    description: 'OTP information',
    type: 'object',
    properties: {
      expiresIn: {
        type: 'string',
        description: 'OTP expiry time',
        example: '2 minutes',
      },
      type: {
        type: 'string',
        description: 'OTP type',
        example: 'registration',
      },
    },
  })
  otpInfo: {
    expiresIn: string;
    type: string;
  };
}

export class ResendOTPDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class UpdateTempUserEmailDto {
  @ApiProperty({
    description: 'Current email address',
    example: 'john@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Current email is required' })
  currentEmail: string;

  @ApiProperty({
    description: 'New email address',
    example: 'john.new@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'New email is required' })
  newEmail: string;
}

export class UpdateTempUserUsernameDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description:
      'New username (minimum 3 characters, letters, numbers, underscores only)',
    example: 'john_new',
    type: String,
    minLength: 3,
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  newUsername: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token from email',
    example: 'abc123def456ghi789',
    type: String,
  })
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @ApiProperty({
    description: 'New password (minimum 6 characters)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Success message',
    example:
      "If an account with that email exists, we've sent a password reset link.",
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Email address where reset link was sent',
    example: 'john@example.com',
    type: String,
  })
  email: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Password has been reset successfully',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      uuid: {
        type: 'string',
        description: 'Unique user identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      username: {
        type: 'string',
        description: 'User username',
        example: 'johndoe',
      },
      email: {
        type: 'string',
        description: 'User email address',
        example: 'john@example.com',
      },
      isActive: {
        type: 'boolean',
        description: 'User account active status',
        example: true,
      },
      updatedAt: {
        type: 'string',
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  user: {
    uuid: string;
    username: string;
    email: string;
    isActive: boolean;
    updatedAt: string;
  };
}
