'use client';

import { useState, Suspense } from 'react';
import {
  LoadingPage,
  Input,
  Button,
  Link,
  Card,
  CardBody,
} from '@/components/ui';
import { Logo } from '@/components/ui/Logo';
import { AuthThemeToggle } from '@/components/ui/AuthThemeToggle';
import { useForgotPassword } from '@/hooks/useAuth';
import {
  validateForgotPasswordForm,
  ForgotPasswordData,
} from './forgot-password';

/**
 * Forgot password form component
 */
function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useForgotPassword();

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

    if (forgotPasswordMutation.isPending) {
      return;
    }

    const validation = validateForgotPasswordForm(formData);
    if (!validation.isValid) {
      return; // Error handling is done by the hook
    }

    forgotPasswordMutation.mutate(formData, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  if (isSubmitted) {
    return (
      <div className="auth-layout">
        {/* Left side - Colorful background only */}
        <div className="auth-promo">
          <img
            src="https://res.cloudinary.com/ds9ufpxom/image/upload/v1765602455/IMGE_1.png"
            alt="Forgot Password"
            className="auth-promo-image"
          />
        </div>

        {/* Right side - Form section with card */}
        <div className="auth-form-section">
          <Card variant="elevated" className="card-elevated auth-card-width">
            <CardBody>
              <div className="auth-container">
                <div className="auth-header">
                  <Logo variant="auto" size="md" />
                  <h1 className="auth-title">Check Your Email</h1>
                  <p className="auth-subtitle">
                    We&apos;ve sent a password reset link to {formData.email}
                  </p>
                </div>

                <div className="auth-form">
                  <div className="form-actions">
                    <Button
                      onClick={() => {
                        setIsSubmitted(false); // Reset to show form again
                        // Send another reset link with the same email
                        forgotPasswordMutation.mutate(formData, {
                          onSuccess: () => {
                            setIsSubmitted(true); // Show success state again
                          },
                        });
                      }}
                      variant="primary"
                      size="lg"
                      loading={forgotPasswordMutation.isPending}
                      loadingText="Sending reset link..."
                      className="auth-button"
                    >
                      Send Another Link
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
                  <AuthThemeToggle />
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
          alt="Forgot Password"
          className="auth-promo-image"
        />
      </div>

      {/* Right side - Form section with card */}
      <div className="auth-form-section">
        <Card variant="elevated" className="card-elevated auth-card-width">
          <CardBody>
            <div className="auth-container">
              <div className="auth-header">
                <Logo variant="auto" size="md" />
                <h1 className="auth-title">Forgot Password?</h1>
                <p className="auth-subtitle">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={forgotPasswordMutation.isPending}
                  />
                </div>

                <div className="form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={forgotPasswordMutation.isPending}
                    loadingText="Sending reset link..."
                    className="auth-button"
                  >
                    Send Reset Link
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
                <AuthThemeToggle />
              </form>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/**
 * Forgot password page component
 * @returns {JSX.Element} The forgot password form component with loading state
 */
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
