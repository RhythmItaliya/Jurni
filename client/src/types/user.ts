/**
 * Authenticated user interface for auth responses
 * @interface AuthUser
 * @property {string} uuid - Unique identifier for the user
 * @property {string} username - User's username
 * @property {string} email - User's email address
 * @property {boolean} isActive - Whether the user account is active
 * @property {string} [otpVerifiedAt] - OTP verification timestamp
 * @property {string} createdAt - Account creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */
export interface AuthUser {
  uuid: string;
  username: string;
  email: string;
  isActive: boolean;
  otpVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Login credentials interface
 * @interface LoginCredentials
 * @property {string} usernameOrEmail - Username or email for login
 * @property {string} password - User's password
 */
export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

/**
 * Registration data interface
 * @interface RegisterData
 * @property {string} username - Desired username
 * @property {string} email - User's email address
 * @property {string} password - User's password
 * @property {string} confirmPassword - Password confirmation
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
