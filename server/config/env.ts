/**
 * Simple Environment Configuration
 * Copy these values to your .env file
 */

export const ENV_VARS = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8081,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/jurni',
  
  // JWT (CHANGE THIS!)
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-this',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Swagger
  SWAGGER_PATH: process.env.SWAGGER_PATH || 'api-docs',
};
