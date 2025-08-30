import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Username (minimum 3 characters)',
    example: 'johndoe',
    type: String,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      uuid: {
        type: 'string',
        description: 'User UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      username: {
        type: 'string',
        description: 'Username',
        example: 'johndoe',
      },
      email: {
        type: 'string',
        description: 'User email',
        example: 'john@example.com',
      },
    },
  })
  user: {
    uuid: string;
    username: string;
    email: string;
  };
}
