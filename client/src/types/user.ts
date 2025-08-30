/**
 * User Interface Types
 * Ensures UUID is never null and is used consistently
 */

export interface User {
  uuid: string; // Required, never null - primary identifier
  username: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  // Extended user profile information
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface AuthUser {
  uuid: string; // Required, never null
  username: string;
  email: string;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

// Type guards to ensure UUID is never null
export const hasValidUuid = (user: unknown): user is User => {
  return user !== null && 
         typeof user === 'object' && 
         user !== null && 
         'uuid' in user && 
         typeof (user as Record<string, unknown>).uuid === 'string' && 
         (user as Record<string, unknown>).uuid !== '';
};

export const isUser = (obj: unknown): obj is User => {
  if (!obj || typeof obj !== 'object' || obj === null) return false;
  
  const userObj = obj as Record<string, unknown>;
  
  return 'uuid' in userObj &&
         typeof userObj.uuid === 'string' && 
         userObj.uuid !== '' &&
         'username' in userObj &&
         typeof userObj.username === 'string' &&
         'email' in userObj &&
         typeof userObj.email === 'string' &&
         'isActive' in userObj &&
         typeof userObj.isActive === 'boolean';
};

export const isAuthUser = (obj: unknown): obj is AuthUser => {
  if (!obj || typeof obj !== 'object' || obj === null) return false;
  
  const userObj = obj as Record<string, unknown>;
  
  return 'uuid' in userObj &&
         typeof userObj.uuid === 'string' && 
         userObj.uuid !== '' &&
         'username' in userObj &&
         typeof userObj.username === 'string' &&
         'email' in userObj &&
         typeof userObj.email === 'string' &&
         'isActive' in userObj &&
         typeof userObj.isActive === 'boolean';
};
