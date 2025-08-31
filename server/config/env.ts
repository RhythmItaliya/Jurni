/**
 * Simple Environment Configuration
 * Copy these values to your .env file
 */

export const ENV_VARS = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8080,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/jurni',
  
  // JWT (CHANGE THIS!)
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-this',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // SMTP Configuration (for registration OTP)
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || 'littlemovie00@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || 'savynzlzsuajspnh',
  SMTP_FROM: process.env.SMTP_FROM || 'littlemovie00@gmail.com',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Swagger
  SWAGGER_PATH: process.env.SWAGGER_PATH || 'api-docs',
};
