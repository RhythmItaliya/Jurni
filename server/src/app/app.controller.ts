import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * Application controller for basic app endpoints
 * Handles root endpoint, health checks, and basic app functionality
 */
@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Root endpoint - returns application name
   * @returns string - Application name
   */
  @Get()
  @ApiOperation({ summary: 'Get application name' })
  @ApiResponse({
    status: 200,
    description: 'Application name returned successfully',
    schema: {
      type: 'string',
      example: 'Jurni Platform API',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Health check endpoint
   * @returns object - Health status information
   */
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Health status returned successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
        version: { type: 'string', example: '1.0.0' },
        uptime: { type: 'number', example: 3600000 },
      },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }

  /**
   * Test endpoint for development/testing
   * @param body - Test message data
   * @returns object - Test response with received data
   */
  @Post('test')
  @ApiOperation({ summary: 'Test endpoint for development' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Test message' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Test message processed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Test response' },
        received: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Test message' },
          },
        },
      },
    },
  })
  testEndpoint(@Body() body: { message: string }) {
    return this.appService.testEndpoint(body);
  }
}
