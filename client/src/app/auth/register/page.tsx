'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { validateRegisterForm } from './register';
import {
  LoadingPage,
  Input,
  Button,
  Link,
  Card,
  CardBody,
} from '@/components/ui';
import { RegisterData } from '@/types/user';
import { useRegister } from '@/hooks/useAuth';
import { useReduxToast } from '@/hooks/useReduxToast';

/**
 * Registration form component that uses search params
 */
function RegisterForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const registerMutation = useRegister();
  const { showSuccess, showError } = useReduxToast();

  // Check if this is a temp user update (coming from OTP page)
  const isTempUserUpdate = searchParams.get('changeEmail') === 'true';

  /**
   * Pre-fill form with URL parameters when coming from OTP page
   * @param {URLSearchParams} searchParams - URL search parameters
   */
  useEffect(() => {
    const email = searchParams.get('email');
    const username = searchParams.get('username');
    const changeEmail = searchParams.get('changeEmail');

    if (changeEmail === 'true' && email && username) {
      const decodedEmail = decodeURIComponent(email);
      const decodedUsername = decodeURIComponent(username);

      setFormData(prev => ({
        ...prev,
        email: decodedEmail,
        username: decodedUsername,
      }));
    }
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
   * Handle form submission and registration
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (registerMutation.isPending) {
      return;
    }

    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      showError('Validation Error', validation.errors.join(', '));
      return;
    }

    if (isTempUserUpdate) {
      // Silent update for temp user - no messages at all
    }

    registerMutation.mutate(formData, {
      onSuccess: () => {
        // Only show success toast for new registrations, not temp user updates
        if (!isTempUserUpdate) {
          showSuccess(
            'Registration Successful',
            'Please check your email for OTP verification'
          );
        }
      },
      // Remove onError handler - useRegister hook already handles errors
    });
  };

  // Remove full page loading - use button spinner instead

  return (
    <div className="auth-layout">
      {/* Left side - Colorful background only */}
      <div className="auth-promo">
        <img
          src="https://res.cloudinary.com/ds9ufpxom/image/upload/v1765601872/2.png"
          alt="Sign up"
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
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">
                  Join us and start your journey today
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    className="form-input"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-input"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={registerMutation.isPending}
                  />
                </div>

                <div className="form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={registerMutation.isPending}
                    loadingText="Creating account..."
                    className="auth-button"
                  >
                    Create Account
                  </Button>
                </div>

                <Link
                  href="/auth/login"
                  variant="forest"
                  size="sm"
                  className="auth-link"
                >
                  Already have an account? Sign In
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
 * Registration page component for creating new user accounts
 * @returns {JSX.Element} The registration form component with loading state
 */
export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RegisterForm />
    </Suspense>
  );
}
