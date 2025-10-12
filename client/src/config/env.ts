/**
 * Client Environment Configuration
 * Copy these values to your .env.local file
 */

export const CLIENT_ENV = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL!,
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT!),

  // Authentication
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  SESSION_MAX_AGE: parseInt(process.env.NEXT_PUBLIC_SESSION_MAX_AGE!),

  // App Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME!,
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION!,

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
};
