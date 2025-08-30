/**
 * Centralized test configuration for the entire test suite
 * Contains constants for endpoints, status codes, timeouts, and test data
 * This ensures consistency across all tests and makes maintenance easier
 */
export const TEST_CONFIG = {
  // Path to test data files
  DATA_PATH: './test/data',
  
  // Test timeout configurations for different test scenarios
  TIMEOUT: {
    SHORT: 5000,    // 5 seconds - for quick unit tests
    MEDIUM: 10000,  // 10 seconds - for integration tests
    LONG: 30000     // 30 seconds - for complex e2e tests
  },
  
  // User-related test constants
  TEST_USERS: {
    DEFAULT_PASSWORD: 'password123',      // Default password for test users
    MIN_USERNAME_LENGTH: 3,              // Minimum username length for validation
    MIN_PASSWORD_LENGTH: 6               // Minimum password length for validation
  },
  
  // API endpoint paths for testing
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',        // User registration endpoint
      LOGIN: '/auth/login'               // User login endpoint
    },
    USERS: {
      LIST: '/users',                    // Get all users endpoint
      BY_UUID: '/users/:uuid'           // Get user by UUID endpoint
    },
    APP: {
      ROOT: '/',                         // Root application endpoint
      HEALTH: '/health',                 // Health check endpoint
      TEST: '/test'                      // Test endpoint
    }
  },
  
  // HTTP status codes for assertions
  STATUS: {
    OK: 200,                            // Success response
    CREATED: 201,                       // Resource created successfully
    BAD_REQUEST: 400,                   // Client error - invalid request
    UNAUTHORIZED: 401,                  // Authentication required
    NOT_FOUND: 404,                     // Resource not found
    CONFLICT: 409                       // Resource conflict (e.g., duplicate user)
  },
  
  // Test message constants for consistent assertions
  TEST_MESSAGES: {
    APP_NAME: 'Jurni Platform API',     // Expected application name
    HEALTH_STATUS: 'ok',                // Expected health check status
    TEST_RESPONSE: 'Test endpoint working' // Expected test endpoint response
  },
  
  // Authentication-related constants
  AUTH: {
    BEARER_PREFIX: 'Bearer '            // JWT token prefix for Authorization header
  }
};
