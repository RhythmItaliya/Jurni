/**
 * Environment Configuration for Vercel deployment
 * Make sure to set these environment variables in your Vercel dashboard
 */

export const ENV_VARS = {
  // Application
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || 3000,
  
  // Database - REQUIRED for production
  MONGODB_URI: process.env.MONGODB_URI || (() => {
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is required in production');
    }
    return 'mongodb://localhost:27017/jurni';
  })(),
  
  // JWT - REQUIRED for production
  JWT_SECRET: process.env.JWT_SECRET || (() => {
    if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required in production');
    }
    return 'your-secret-key-change-this';
  })(),
  
  // CORS - Default to allow all origins for Vercel
  CORS_ORIGIN: process.env.CORS_ORIGIN || (
    process.env.NODE_ENV === 'production' ? 
    'https://your-frontend-domain.vercel.app' : 
    'http://localhost:3000'
  ),
  
  // SMTP Configuration (for registration OTP)
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'error' : 'info'),
  
  // Swagger
  SWAGGER_PATH: process.env.SWAGGER_PATH || 'api-docs',
};
