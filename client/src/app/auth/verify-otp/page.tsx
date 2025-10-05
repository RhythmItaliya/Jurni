'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { validateOTPForm } from './verify-otp';
import {
  LoadingPage,
  Input,
  Button,
  Link,
  Card,
  CardBody,
} from '@/components/ui';
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
   * Handle paste event to fill all OTP inputs at once
   * @param {React.ClipboardEvent} e - Clipboard event
   */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Only process if pasted data is 6 characters and contains only letters/numbers
    if (pastedData.length === 6 && /^[A-Za-z0-9]+$/.test(pastedData)) {
      const newOtp = pastedData.toUpperCase().split('');
      setOtp(newOtp);

      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  /**
   * Handle OTP form submission and verification
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (verifyOTPMutation.isPending) {
      return;
    }

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
        // Remove onError handler - useVerifyOTP hook already handles errors
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
      onError: () => {
        // Remove onError handler - useResendOTP hook already handles errors
      },
    });
  };

  if (!decodedEmail || !decodedUsername) {
    return <LoadingPage />;
  }

  // Remove full page loading for OTP verification - use button spinner instead

  return (
    <div className="auth-layout">
      {/* Left side - Image */}
      <div className="auth-promo"></div>

      {/* Right side - OTP form section with card */}
      <div className="auth-form-section">
        <Card variant="elevated" className="card-flat auth-card-width">
          <CardBody>
            <div className="auth-container">
              <div className="auth-header">
                <Link href="/" className="auth-logo-placeholder">
                  Jurni
                </Link>
                <h1 className="auth-title">Verify Your Registration</h1>
                <p className="auth-subtitle">
                  We sent a 6-character code to{' '}
                  <span className="text-primary">{decodedEmail}</span>
                  {decodedUsername && (
                    <>
                      {' '}
                      for user{' '}
                      <span className="text-primary">{decodedUsername}</span>
                    </>
                  )}
                </p>
              </div>

              <form
                className="auth-form"
                onSubmit={handleSubmit}
                onPaste={handlePaste}
              >
                <div className="form-group">
                  <label htmlFor="otp" className="otp-label">
                    Enter OTP
                  </label>
                  <div className="otp-inputs">
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
                        className="otp-input"
                        placeholder="•"
                        disabled={verifyOTPMutation.isPending}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={verifyOTPMutation.isPending}
                    loadingText="Verifying..."
                    className="auth-button"
                  >
                    Verify OTP
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOTPRequest}
                  loading={resendOTPMutation.isPending}
                  loadingText="Sending..."
                  className="auth-link"
                >
                  Didn&apos;t receive the code? Resend
                </Button>

                <div className="auth-divider">
                  <span>or</span>
                </div>

                <Link
                  href={`/auth/register?email=${encodeURIComponent(decodedEmail || '')}&username=${encodeURIComponent(decodedUsername || '')}&changeEmail=true`}
                  variant="warning"
                  size="sm"
                  className="auth-link"
                >
                  Change Email Address
                </Link>

                <Link
                  href="/auth/register"
                  variant="ghost"
                  size="sm"
                  className="auth-link"
                >
                  Back to registration
                </Link>
              </form>
            </div>
          </CardBody>
        </Card>
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
