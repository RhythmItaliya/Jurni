import { AuthUser } from './user';

/**
 * Base API response interface matching server BaseResponseDto
 * @interface ApiResponse
 * @property {boolean} success - Operation success status
 * @property {string} message - Response message
 * @property {T} [data] - Response data (optional)
 * @property {PaginationMeta} [meta] - Pagination metadata (optional)
 * @property {string} [error] - Error message (optional)
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  error?: string;
}

/**
 * Pagination metadata interface
 * @interface PaginationMeta
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Auth response data interfaces
 */
export interface LoginResponseData {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponseData {
  user: AuthUser;
  otpInfo?: {
    expiresIn: string;
    type: string;
  };
}

export interface VerifyOtpResponseData {
  email: string;
  otpVerifiedAt?: string;
  user: AuthUser;
}

export interface ResendOtpResponseData {
  email: string;
  username: string;
  otpInfo: {
    expiresIn: string;
    type: string;
  };
}

export interface UpdateTempUserResponseData {
  user: AuthUser;
}

export interface ForgotPasswordResponseData {
  email: string;
}

export interface ResetPasswordResponseData {
  user: AuthUser;
}

export interface VerifyResetTokenResponseData {
  valid: boolean;
}

/**
 * Auth API response types
 */
export type LoginResponse = ApiResponse<LoginResponseData>;
export type RegisterResponse = ApiResponse<RegisterResponseData>;
export type VerifyOtpResponse = ApiResponse<VerifyOtpResponseData>;
export type ResendOtpResponse = ApiResponse<ResendOtpResponseData>;
export type UpdateTempUserResponse = ApiResponse<UpdateTempUserResponseData>;
export type ForgotPasswordResponse = ApiResponse<ForgotPasswordResponseData>;
export type ResetPasswordResponse = ApiResponse<ResetPasswordResponseData>;
export type VerifyResetTokenResponse =
  ApiResponse<VerifyResetTokenResponseData>;
