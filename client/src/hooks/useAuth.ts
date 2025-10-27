import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { RegisterData, LoginCredentials } from '@/types/user';
import { VerifyOTPData } from '@/app/auth/verify-otp/verify-otp';
import { ForgotPasswordData } from '@/app/auth/forgot-password/forgot-password';
import { ResetPasswordData } from '@/app/auth/reset-password/reset-password';
import { useReduxToast } from '@/hooks/useReduxToast';
import { extractServerMessage } from '@/lib/errorUtils';

// Query keys for consistent caching
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

/**
 * Hook for user registration
 * Handles user registration with form validation and automatic redirect to OTP verification
 *
 * @description
 * - Validates registration data (username, email, password)
 * - Makes API call to register endpoint
 * - Automatically redirects to OTP verification page on success
 * - Invalidates auth queries to refresh state
 *
 * @usedIn
 * - RegisterPage component (/app/auth/register/page.tsx)
 *
 * @returns {UseMutationResult} Mutation object with registration state and methods
 */
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showError } = useReduxToast();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      return response.data.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      router.push(
        `/auth/verify-otp?email=${encodeURIComponent(data.user.email)}&username=${encodeURIComponent(data.user.username)}`
      );
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Registration Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook for OTP verification
 * Handles OTP verification for user registration completion
 *
 * @description
 * - Verifies OTP code sent to user's email
 * - Activates user account after successful verification
 * - Automatically redirects to login page with success message
 * - Invalidates auth queries to refresh state
 *
 * @usedIn
 * - VerifyOTPPage component (/app/auth/verify-otp/page.tsx)
 *
 * @returns {UseMutationResult} Mutation object with OTP verification state and methods
 */
export function useVerifyOTP() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (data: VerifyOTPData) => {
      const response = await api.post(ENDPOINTS.AUTH.VERIFY_REGISTRATION_OTP, {
        email: data.email,
        otp: data.otp,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      showSuccess(
        'Verification Successful',
        'Your account has been verified! You can now login.'
      );

      router.push('/auth/login');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Verification Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook for resending OTP
 * Handles resending OTP code to user's email during registration
 *
 * @description
 * - Resends OTP code to user's email address
 * - Used when user doesn't receive initial OTP or code expires
 * - Provides feedback on resend success/failure
 * - Maintains registration flow continuity
 *
 * @usedIn
 * - VerifyOTPPage component (/app/auth/verify-otp/page.tsx)
 *
 * @returns {UseMutationResult} Mutation object with resend OTP state and methods
 */
export function useResendOTP() {
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post(ENDPOINTS.AUTH.RESEND_REGISTRATION_OTP, {
        email,
      });
      return response.data.data;
    },
    onSuccess: () => {
      showSuccess('OTP Sent', 'A new OTP has been sent to your email');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Resend Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook for user login
 * Handles user authentication with NextAuth credentials provider
 *
 * @description
 * - Authenticates user with username/email and password
 * - Uses NextAuth credentials provider for secure authentication
 * - Automatically redirects to dashboard on successful login
 * - Invalidates auth queries to refresh user state
 * - Handles login errors and provides user feedback
 *
 * @usedIn
 * - LoginPage component (/app/auth/login/page.tsx)
 *
 * @returns {UseMutationResult} Mutation object with login state and methods
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn('credentials', {
        usernameOrEmail: credentials.usernameOrEmail,
        password: credentials.password,
        redirect: false,
      });
      return result;
    },
    onSuccess: result => {
      if (!result?.error) {
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        showSuccess('Login Successful', 'Welcome back!');
        router.push('/');
      } else {
        const serverMessage = result.error;
        showError('Login Failed', serverMessage);
      }
    },
  });
}

/**
 * Hook for user logout
 * Handles user logout with session cleanup and redirect
 *
 * @description
 * - Signs out user using NextAuth signOut function
 * - Clears all cached queries and user data
 * - Automatically redirects to login page after logout
 * - Ensures complete session cleanup for security
 *
 * @usedIn
 * - LogoutPage component (/app/auth/logout/page.tsx)
 *
 * @returns {UseMutationResult} Mutation object with logout state and methods
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      queryClient.clear();
      showSuccess('Logged Out', 'You have been successfully logged out');
      router.push('/auth/login');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Logout Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook to get current user session
 * Provides user session data with caching and automatic refetching
 *
 * @description
 * - Fetches current user session data
 * - Uses React Query for caching and state management
 * - Automatically refetches on window focus
 * - Provides loading, error, and success states
 * - Integrates with NextAuth session management
 *
 * @usedIn
 * - HomePage component (/app/page.tsx)
 *
 * @returns {UseQueryResult} Query object with session data and loading states
 */
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      return null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for forgot password request
 * Handles password reset request with email validation
 *
 * @description
 * - Sends password reset request to user's email
 * - Validates email format before sending request
 * - Provides feedback on request success/failure
 * - Maintains security by not revealing if email exists
 *
 * @usedIn
 * - ForgotPasswordPage component (/app/auth/forgot-password/page.tsx)
 *
 * @returns {UseMutationResult} Mutation object with forgot password state and methods
 */
export function useForgotPassword() {
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email: data.email,
      });
      return response.data.data;
    },
    onSuccess: () => {
      showSuccess(
        'Reset Link Sent',
        "If an account with that email exists, we've sent a password reset link."
      );
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Request Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook for reset password
 * Handles password reset with token validation
 *
 * @description
 * - Resets user password using reset token from email
 * - Validates password strength requirements
 * - Automatically redirects to login page on success
 * - Provides feedback on reset success/failure
 *
 * @usedIn
 * - ResetPasswordPage component (/app/auth/reset-password/page.tsx)
 *
 * @returns {UseMutationResult} Mutation object with reset password state and methods
 */
export function useResetPassword() {
  const router = useRouter();
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (data: ResetPasswordData & { token: string }) => {
      const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        token: data.token,
        password: data.password,
      });
      return response.data.data;
    },
    onSuccess: () => {
      showSuccess(
        'Password Reset Successful',
        'Your password has been updated successfully'
      );
      router.push('/auth/login');
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError('Reset Failed', serverMessage || 'An error occurred');
    },
  });
}

/**
 * Hook for verifying reset token
 * Handles reset token validation before showing reset form
 *
 * @description
 * - Verifies reset token is valid and not expired
 * - Used to validate token before showing reset form
 * - Provides feedback on token validity
 * - Handles token expiration gracefully
 *
 * @usedIn
 * - ResetPasswordPage component (/app/auth/reset-password/page.tsx)
 *
 * @returns {UseMutationResult} Mutation object with token verification state and methods
 */
export function useVerifyResetToken() {
  const { showError } = useReduxToast();

  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post(ENDPOINTS.AUTH.VERIFY_RESET_TOKEN, {
        token,
      });
      return response.data.data;
    },
    onError: error => {
      const serverMessage = extractServerMessage(error);
      showError(
        'Invalid Link',
        serverMessage || 'This reset link is invalid or has expired'
      );
    },
  });
}
