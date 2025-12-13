'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  LoadingPage,
  Input,
  Button,
  Link,
  Card,
  CardBody,
} from '@/components/ui';
import { useResetPassword, useVerifyResetToken } from '@/hooks/useAuth';
import { validateResetPasswordForm, ResetPasswordData } from './reset-password';
import { useReduxToast } from '@/hooks/useReduxToast';

/**
 * Reset password form component
 */
function ResetPasswordForm() {
  const [formData, setFormData] = useState<ResetPasswordData>({
    password: '',
    confirmPassword: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const resetPasswordMutation = useResetPassword();
  const verifyTokenMutation = useVerifyResetToken();
  const { showError } = useReduxToast();

  /**
   * Get token from URL parameters and verify it
   */
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      // Verify token with backend
      verifyTokenMutation.mutate(tokenParam, {
        onError: () => {
          setToken(null);
        },
      });
    } else {
      setToken(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /**
   * Handle form input changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submission
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (resetPasswordMutation.isPending) {
      return;
    }

    if (!token) {
      showError('Invalid Link', 'This reset link is invalid or has expired');
      return;
    }

    const validation = validateResetPasswordForm(formData);
    if (!validation.isValid) {
      const message = validation.errors.join('\n');
      showError(
        'Invalid Password',
        message || 'Please fix the highlighted errors'
      );
      return;
    }

    resetPasswordMutation.mutate(
      { ...formData, token },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="auth-layout">
        {/* Left side - Colorful background only */}
        <div className="auth-promo">
          <img
            src="https://res.cloudinary.com/ds9ufpxom/image/upload/v1765602455/IMGE_1.png"
            alt="Reset Password"
            className="auth-promo-image"
          />
        </div>

        {/* Right side - Form section with card */}
        <div className="auth-form-section">
          <Card variant="elevated" className="card-elevated auth-card-width">
            <CardBody>
              <div className="auth-container">
                <div className="auth-header">
                  <Link href="/" className="auth-logo-placeholder">
                    <img
                      src="https://res.cloudinary.com/ds9ufpxom/image/upload/v1765603404/Jurni_.png"
                      alt="Jurni"
                      className="auth-logo-image"
                    />
                  </Link>
                  <h1 className="auth-title">Password Reset Complete</h1>
                  <p className="auth-subtitle">
                    Your password has been successfully updated
                  </p>
                </div>

                <div className="auth-form">
                  <div className="form-actions">
                    <Button
                      onClick={() => (window.location.href = '/auth/login')}
                      variant="primary"
                      size="lg"
                      className="auth-button"
                    >
                      Sign In Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="auth-layout">
        {/* Left side - Colorful background only */}
        <div className="auth-promo">
          <img
            src="https://res.cloudinary.com/ds9ufpxom/image/upload/v1765602455/IMGE_1.png"
            alt="Reset Password"
            className="auth-promo-image"
          />
        </div>

        {/* Right side - Form section with card */}
        <div className="auth-form-section">
          <Card variant="elevated" className="card-elevated auth-card-width">
            <CardBody>
              <div className="auth-container">
                <div className="auth-header">
                  <Link href="/" className="auth-logo-placeholder">
                    <img
                      src="https://res.cloudinary.com/ds9ufpxom/image/upload/v1765603404/Jurni_.png"
                      alt="Jurni"
                      className="auth-logo-image"
                    />
                  </Link>
                  <h1 className="auth-title">Invalid Reset Link</h1>
                  <p className="auth-subtitle">
                    This password reset link is invalid or has expired
                  </p>
                </div>

                <div className="auth-form">
                  <div className="form-actions">
                    <Button
                      onClick={() =>
                        (window.location.href = '/auth/forgot-password')
                      }
                      variant="primary"
                      size="lg"
                      className="auth-button"
                    >
                      Request New Link
                    </Button>
                  </div>

                  <Link
                    href="/auth/login"
                    variant="forest"
                    size="sm"
                    className="auth-link"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      {/* Left side - Colorful background only */}
      <div className="auth-promo">
        <img
          src="https://res.cloudinary.com/ds9ufpxom/image/upload/v1765602455/IMGE_1.png"
          alt="Reset Password"
          className="auth-promo-image"
        />
      </div>

      {/* Right side - Form section with card */}
      <div className="auth-form-section">
        <Card variant="elevated" className="card-elevated auth-card-width">
          <CardBody>
            <div className="auth-container">
              <div className="auth-header">
                <div className="auth-logo-placeholder">
                  <img
                    src="https://res.cloudinary.com/ds9ufpxom/image/upload/v1765603404/Jurni_.png"
                    alt="Jurni"
                    className="auth-logo-image"
                  />
                </div>
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">Enter your new password below</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={resetPasswordMutation.isPending}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-input"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={resetPasswordMutation.isPending}
                  />
                </div>

                <div className="form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={resetPasswordMutation.isPending}
                    loadingText="Updating password..."
                    className="auth-button"
                  >
                    Update Password
                  </Button>
                </div>

                <Link
                  href="/auth/login"
                  variant="forest"
                  size="sm"
                  className="auth-link"
                >
                  Back to Sign In
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
 * Reset password page component
 * @returns {JSX.Element} The reset password form component with loading state
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
