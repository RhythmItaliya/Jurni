import { ApiProperty } from '@nestjs/swagger';

/**
 * Base response DTO for all API responses
 * Ensures consistent response structure across all endpoints
 */
export class BaseResponseDto {
  @ApiProperty({
    description: 'Operation success status',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    required: false,
  })
  data?: any;

  @ApiProperty({
    description: 'Pagination metadata',
    required: false,
  })
  meta?: any;

  @ApiProperty({
    description: 'Error message (only present when success is false)',
    example: 'Validation failed',
    type: String,
    required: false,
  })
  error?: string;
}

/**
 * Success response helper
 */
export function createSuccessResponse(
  message: string,
  data?: any,
  meta?: any,
): BaseResponseDto {
  return {
    success: true,
    message,
    data,
    meta,
  };
}

/**
 * Error response helper
 */
export function createErrorResponse(
  message: string,
  error?: string,
): BaseResponseDto {
  return {
    success: false,
    message,
    error,
  };
}
