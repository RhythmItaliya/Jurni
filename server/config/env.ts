/**
 * Simple Environment Configuration
 * Copy these values to your .env file
 */

export const ENV_VARS = {
  // Application
  NODE_ENV: process.env.NODE_ENV!,
  PORT: parseInt(process.env.PORT!, 10),
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI!,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN!,
  
  // SMTP Configuration (for registration OTP)
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: parseInt(process.env.SMTP_PORT!, 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  SMTP_FROM: process.env.SMTP_FROM!,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL!,
  
  // Swagger
  SWAGGER_PATH: process.env.SWAGGER_PATH!,
};