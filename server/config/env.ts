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
  
  // Cloudflare R2 Storage
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME!,
  R2_ENDPOINT: process.env.R2_ENDPOINT!,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL!,

  // Super Admin Credentials
  SUPER_ADMIN_USERNAME: process.env.SUPER_ADMIN_USERNAME!,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL!,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD!,
};