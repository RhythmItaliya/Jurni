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
