'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { validateLoginForm } from './login';
import { LoginCredentials } from '@/types/user';
import {
  LoadingPage,
  Input,
  Button,
  Link,
  Card,
  CardBody,
} from '@/components/ui';
import { useLogin } from '@/hooks/useAuth';
import { useReduxToast } from '@/hooks/useReduxToast';

/**
 * Login form component that uses search params
 */
function LoginForm() {
  const [formData, setFormData] = useState<LoginCredentials>({
    usernameOrEmail: '',
    password: '',
  });
  const searchParams = useSearchParams();

  const loginMutation = useLogin();
  const { showSuccess, showError } = useReduxToast();

  /**
   * Handle URL message parameter
   * @param {URLSearchParams} searchParams - URL search parameters
   */
  useEffect(() => {
    const msg = searchParams.get('message');
    if (msg) {
      showSuccess('Success', msg);
    }
  }, [searchParams, showSuccess]);

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
   * Handle form submission and login
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (loginMutation.isPending) {
      return;
    }

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      showError('Validation Error', validation.errors.join(', '));
      return;
    }

    loginMutation.mutate(formData, {
      // Remove onError handler - useLogin hook already handles errors
    });
  };

  return (
    <div className="auth-layout">
      {/* Left side - Colorful background only */}
      <div className="auth-promo"></div>

      {/* Right side - Form section with card */}
      <div className="auth-form-section">
        <Card variant="elevated" className="card-flat auth-card-width">
          <CardBody>
            <div className="auth-container">
              <div className="auth-header">
                <Link href="/" className="auth-logo-placeholder">
                  Jurni
                </Link>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">
                  Enter your email and password to access your account
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="usernameOrEmail">Email</label>
                  <Input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.usernameOrEmail}
                    onChange={handleInputChange}
                    disabled={loginMutation.isPending}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loginMutation.isPending}
                  />
                </div>

                <div className="form-actions">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loginMutation.isPending}
                    loadingText="Signing in..."
                    className="auth-button"
                  >
                    Sign In
                  </Button>
                </div>

                <div className="auth-links-container">
                  <Link
                    href="/auth/forgot-password"
                    variant="forest"
                    size="sm"
                    className="auth-link-forgot"
                  >
                    Forgot Password?
                  </Link>

                  <Link
                    href="/auth/register"
                    variant="forest"
                    size="sm"
                    className="auth-link"
                  >
                    Don&apos;t have an account? Sign Up
                  </Link>
                </div>
              </form>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/**
 * Login page component for user authentication
 * @returns {JSX.Element} The login form component with loading state
 */
export default function Login() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LoginForm />
    </Suspense>
  );
}
