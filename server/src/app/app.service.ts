import { Injectable } from '@nestjs/common';

/**
 * Application service for basic app functionality
 * Handles application name, health checks, and test endpoints
 */
@Injectable()
export class AppService {
  /**
   * Returns the application name
   * @returns string - Application name
   */
  getHello(): string {
    return 'Jurni Platform API';
  }

  /**
   * Returns health status information
   * @returns object - Health status data
   */
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime() * 1000, // Convert to milliseconds
    };
  }

  /**
   * Processes test endpoint requests
   * @param body - Test message data
   * @returns object - Test response with received data
   */
  testEndpoint(body: { message: string }) {
    return {
      message: 'Test response',
      received: body,
    };
  }
}
