import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  to: string;

  @ApiProperty({
    description: 'Email subject',
    example: 'Welcome to our platform',
    type: String,
  })
  @IsString({ message: 'Subject must be a string' })
  @IsNotEmpty({ message: 'Subject is required' })
  @MinLength(1, { message: 'Subject must not be empty' })
  subject: string;

  @ApiProperty({
    description: 'Email content (HTML)',
    example: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
    type: String,
  })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(1, { message: 'Content must not be empty' })
  content: string;
}

export class EmailResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Email sent successfully',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com',
    type: String,
  })
  to: string;

  @ApiProperty({
    description: 'Email subject',
    example: 'Welcome to our platform',
    type: String,
  })
  subject: string;
}
