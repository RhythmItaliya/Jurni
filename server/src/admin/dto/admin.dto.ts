import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({
    description: 'Admin username or email',
    example: 'admin@jurni.com',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'SecurePassword123!',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class AdminRegisterDto {
  @ApiProperty({
    description: 'Admin username',
    example: 'admin_john',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@jurni.com',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'SecurePassword123!',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Admin role',
    example: 'admin',
    enum: ['super_admin', 'admin'],
    type: String,
    required: false,
  })
  @IsString()
  role?: string;
}

export class UpdateAdminDto {
  @ApiProperty({
    description: 'Admin username',
    example: 'admin_john',
    type: String,
    required: false,
  })
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@jurni.com',
    type: String,
    required: false,
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Admin role',
    example: 'admin',
    enum: ['super_admin', 'admin'],
    type: String,
    required: false,
  })
  @IsString()
  role?: string;
}

export class ChangeAdminPasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'OldPassword123!',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewPassword123!',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}
