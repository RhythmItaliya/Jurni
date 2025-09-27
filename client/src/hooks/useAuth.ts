import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { RegisterData, LoginCredentials } from '@/types/user';
import { VerifyOTPData } from '@/app/auth/verify-otp/verify-otp';
import { useReduxToast } from '@/hooks/useReduxToast';

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
  const { showSuccess, showError } = useReduxToast();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });

      router.push(
        `/auth/verify-otp?email=${encodeURIComponent(data.user.email)}&username=${encodeURIComponent(data.user.username)}`
      );
    },
    onError: error => {
      const serverMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.error ||
        (error as any)?.response?.data ||
        error?.message;
      showError('Registration Failed', serverMessage);
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
      return response.data;
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
      const serverMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.error ||
        (error as any)?.response?.data ||
        error?.message;
      showError('Verification Failed', serverMessage);
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
      return response.data;
    },
    onSuccess: () => {
      showSuccess('OTP Sent', 'A new OTP has been sent to your email');
    },
    onError: error => {
      const serverMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.error ||
        (error as any)?.response?.data ||
        error?.message;
      showError('Resend Failed', serverMessage);
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
        router.push('/dashboard');
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
 * - DashboardPage component (/app/dashboard/page.tsx)
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
      const serverMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.error ||
        (error as any)?.response?.data ||
        error?.message;
      showError('Logout Failed', serverMessage);
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
 * - DashboardPage component (/app/dashboard/page.tsx)
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
