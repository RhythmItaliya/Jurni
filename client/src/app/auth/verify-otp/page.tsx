'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { validateOTPForm } from './verify-otp';
import { LoadingPage, Input } from '@/components/ui';
import { useVerifyOTP, useResendOTP } from '@/hooks/useAuth';
import { useReduxToast } from '@/hooks/useReduxToast';

/**
 * OTP verification form component that uses search params
 * Handles 6-character OTP input with auto-focus and validation
 * @returns {JSX.Element | null} The OTP verification form or null if redirecting
 */
function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOTPMutation = useVerifyOTP();
  const resendOTPMutation = useResendOTP();
  const { showSuccess, showError } = useReduxToast();

  const email = searchParams.get('email');
  const username = searchParams.get('username');

  const decodedEmail = email ? decodeURIComponent(email) : null;
  const decodedUsername = username ? decodeURIComponent(username) : null;

  /**
   * Redirect to registration if email is missing or if coming from registration without username
   * @param {string | null} decodedEmail - Decoded email from URL params
   * @param {string | null} decodedUsername - Decoded username from URL params
   * @param {Object} router - Next.js router instance
   */
  useEffect(() => {
    if (!decodedEmail) {
      router.push('/auth/register');
    } else if (!decodedUsername) {
      router.push('/auth/register');
    }
  }, [decodedEmail, decodedUsername, router]);

  /**
   * Handle OTP input change with auto-focus to next field
   * @param {number} index - Current input field index
   * @param {string} value - Input value (converted to uppercase)
   */
  const handleInputChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle backspace key to move to previous input field
   * @param {number} index - Current input field index
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Handle OTP form submission and verification
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    const validation = validateOTPForm(otpString);

    if (!validation.isValid) {
      showError('Invalid OTP', validation.error || 'OTP must be 6 characters');
      return;
    }

    if (!decodedEmail) {
      showError('Error', 'Email not found. Please try again.');
      return;
    }

    verifyOTPMutation.mutate(
      {
        email: decodedEmail,
        otp: otpString,
      },
      {
        onError: error => {
          const serverMessage =
            error && typeof error === 'object' && 'response' in error
              ? (
                  error as {
                    response: { data?: { message?: string; error?: string } };
                  }
                ).response.data?.message ||
                (
                  error as {
                    response: { data?: { message?: string; error?: string } };
                  }
                ).response.data?.error ||
                String(
                  (error as { response: { data?: unknown } }).response.data
                )
              : (error as { message?: string })?.message;
          showError(
            'Verification Failed',
            serverMessage || 'An error occurred'
          );
        },
      }
    );
  };

  /**
   * Handle resend OTP request
   * @param {string | null} decodedEmail - User's email address
   */
  const handleResendOTPRequest = async () => {
    if (!decodedEmail) {
      showError('Error', 'Email not found. Please try again.');
      return;
    }

    resendOTPMutation.mutate(decodedEmail, {
      onSuccess: () => {
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        showSuccess('OTP Sent', 'A new OTP has been sent to your email');
      },
      onError: error => {
        const serverMessage =
          error && typeof error === 'object' && 'response' in error
            ? (error as { response: { data?: { message?: string } } }).response
                .data?.message
            : (error as { message?: string })?.message;
        showError('Resend Failed', serverMessage || 'An error occurred');
      },
    });
  };

  if (!decodedEmail || !decodedUsername) {
    return <LoadingPage />;
  }

  if (verifyOTPMutation.isPending) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a 6-character code (letters and numbers) to{' '}
            <span className="font-medium text-indigo-600">{decodedEmail}</span>
          </p>
          {decodedUsername && (
            <p className="mt-1 text-center text-sm text-gray-600">
              for user{' '}
              <span className="font-medium text-indigo-600">
                {decodedUsername}
              </span>
            </p>
          )}
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          suppressHydrationWarning
        >
          <div>
            <label htmlFor="otp" className="sr-only">
              Enter OTP
            </label>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(index, e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(index, e)
                  }
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-black rounded-lg focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none text-black"
                  placeholder="?"
                />
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={verifyOTPMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {verifyOTPMutation.isPending ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTPRequest}
              disabled={resendOTPMutation.isPending}
              className="text-indigo-600 hover:text-indigo-500 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendOTPMutation.isPending
                ? 'Sending...'
                : "Didn't receive the code? Resend"}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href={`/auth/register?email=${encodeURIComponent(decodedEmail || '')}&username=${encodeURIComponent(decodedUsername || '')}&changeEmail=true`}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Change Email Address
            </Link>
            <div className="text-gray-400">•</div>
            <Link
              href="/auth/register"
              className="text-gray-600 hover:text-gray-500 text-sm"
            >
              Back to registration
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * OTP verification page component for user registration
 * Handles 6-character OTP input with auto-focus and validation
 * @returns {JSX.Element | null} The OTP verification form or null if redirecting
 */
export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <VerifyOTPForm />
    </Suspense>
  );
}
