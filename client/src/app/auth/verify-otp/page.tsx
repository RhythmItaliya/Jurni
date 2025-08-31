'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  handleVerifyOTP,
  validateOTPForm,
  handleResendOTP,
} from './verify-otp';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = searchParams.get('email');
  const username = searchParams.get('username');

  // Decode the URL parameters properly
  const decodedEmail = email ? decodeURIComponent(email) : null;
  const decodedUsername = username ? decodeURIComponent(username) : null;

  // Redirect if no email or username
  useEffect(() => {
    if (!decodedEmail || !decodedUsername) {
      router.push('/auth/register');
    }
  }, [decodedEmail, decodedUsername, router]);

  // Auto-focus next input
  const handleInputChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    const validation = validateOTPForm(otpString);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    if (!decodedEmail) {
      setError('Email not found. Please register again.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await handleVerifyOTP({
        email: decodedEmail,
        otp: otpString,
      });

      if (result.success) {
        // Redirect to login with success message
        router.push('/auth/login');
      } else {
        setError(result.error || 'Verification failed');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTPRequest = async () => {
    if (!decodedEmail) {
      setError('Email not found. Please register again.');
      return;
    }

    setIsResending(true);
    setError('');

    try {
      const result = await handleResendOTP(decodedEmail);

      if (result.success) {
        // Reset OTP input
        setOtp(['', '', '', '', '', '']);
        // Focus first input
        inputRefs.current[0]?.focus();
        setError(''); // Clear any previous errors
      } else {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!decodedEmail || !decodedUsername) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a 6-character code to{' '}
            <span className="font-medium text-indigo-600">{decodedEmail}</span>
          </p>
          <p className="mt-1 text-center text-sm text-gray-600">
            for user{' '}
            <span className="font-medium text-indigo-600">
              {decodedUsername}
            </span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="sr-only">
              Enter OTP
            </label>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleInputChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-black rounded-lg focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none text-black"
                  placeholder="•"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTPRequest}
              disabled={isResending}
              className="text-indigo-600 hover:text-indigo-500 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : "Didn't receive the code? Resend"}
            </button>
          </div>

          <div className="text-center">
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
