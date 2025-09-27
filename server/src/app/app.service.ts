import { Injectable } from '@nestjs/common';

/**
 * Application service for basic app functionality
 * Handles application name and health checks
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
}
