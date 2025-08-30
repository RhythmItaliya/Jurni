import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { TEST_CONFIG } from '../test-config';
import { appData, usersData, authData } from '../data';

/**
 * Utility class providing helper methods for testing
 * Contains methods for app setup, data generation, and cleanup
 * Uses JSON test data files for consistent test data
 */
export class TestUtils {
  /**
   * Creates a testing NestJS application with global validation pipe
   * @returns Promise<INestApplication> - Configured test application instance
   */
  static async createTestingApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    
    // Enable global validation pipe for consistent testing
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();
    return app;
  }

  /**
   * Generates a unique email address for testing
   * Uses timestamp to ensure uniqueness across test runs
   * @returns string - Unique email address
   */
  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    return `test${timestamp}@example.com`;
  }

  /**
   * Generates a unique username for testing
   * Uses timestamp to ensure uniqueness across test runs
   * @returns string - Unique username
   */
  static generateUniqueUsername(): string {
    const timestamp = Date.now();
    return `testuser${timestamp}`;
  }

  /**
   * Generates complete user data object with unique values
   * Ensures each test has unique data to prevent conflicts
   * @returns object - User data with username, email, and password
   */
  static generateUniqueUserData() {
    const timestamp = Date.now();
    return {
      username: `testuser${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: TEST_CONFIG.TEST_USERS.DEFAULT_PASSWORD
    };
  }

  /**
   * Retrieves predefined valid user data from test data JSON
   * @param userType - Key of validUser object in test data
   * @returns object - User data object
   */
  static getTestUserData(userType: keyof typeof usersData.validUser) {
    return usersData.validUser[userType];
  }

  /**
   * Retrieves predefined invalid user data for negative testing
   * @param invalidType - Key of invalidUsers object in test data
   * @returns object - Invalid user data object
   */
  static getInvalidUserData(invalidType: keyof typeof usersData.invalidUsers) {
    return usersData.invalidUsers[invalidType];
  }

  /**
   * Retrieves predefined login credentials for authentication testing
   * @param credentialType - Key of loginCredentials object in test data
   * @returns object - Login credentials object
   */
  static getLoginCredentials(credentialType: keyof typeof usersData.loginCredentials) {
    return usersData.loginCredentials[credentialType];
  }

  /**
   * Retrieves predefined mock user objects for service testing
   * @param userType - Key of mockUsers object in test data
   * @returns object - Mock user object
   */
  static getMockUser(userType: keyof typeof usersData.mockUsers) {
    return usersData.mockUsers[userType];
  }

  /**
   * Retrieves predefined test UUIDs for various testing scenarios
   * @param uuidType - Key of testUuids object in test data
   * @returns string - Test UUID value
   */
  static getTestUuid(uuidType: keyof typeof usersData.testUuids) {
    return usersData.testUuids[uuidType];
  }

  /**
   * Retrieves predefined test data values for assertions
   * @param dataType - Key of testData object in test data
   * @returns any - Test data value
   */
  static getTestData(dataType: keyof typeof usersData.testData) {
    return usersData.testData[dataType];
  }

  /**
   * Retrieves app test data for testing
   * @param dataType - Key of app data
   * @returns any - App test data value
   */
  static getAppTestData(dataType: keyof typeof appData) {
    return appData[dataType];
  }

  /**
   * Retrieves auth test data for testing
   * @param dataType - Key of auth data
   * @returns any - Auth test data value
   */
  static getAuthTestData(dataType: keyof typeof authData) {
    return authData[dataType];
  }

  /**
   * Safely closes the test application to prevent memory leaks
   * @param app - NestJS application instance to close
   */
  static async cleanupApp(app: INestApplication): Promise<void> {
    if (app) {
      await app.close();
    }
  }
}
