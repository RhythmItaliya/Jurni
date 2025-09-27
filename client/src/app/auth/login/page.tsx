'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { validateLoginForm } from './login';
import { LoginCredentials } from '@/types/user';
import { LoadingPage, Input, Button } from '@/components/ui';
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
  const [message, setMessage] = useState('');
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
      setMessage(msg);
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

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      showError('Validation Error', validation.errors.join(', '));
      return;
    }

    loginMutation.mutate(formData, {
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
              String((error as { response: { data?: unknown } }).response.data)
            : (error as { message?: string })?.message;
        showError('Login Failed', serverMessage || 'An error occurred');
      },
    });
  };

  if (loginMutation.isPending) {
    return <LoadingPage />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">Jurni</div>
          <h1 className="auth-title">Sign in to your account</h1>
          <p className="auth-subtitle">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        {message && <div className="auth-message success">{message}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <Input
              id="usernameOrEmail"
              name="usernameOrEmail"
              type="text"
              required
              className="form-input"
              placeholder="Username or Email address"
              value={formData.usernameOrEmail}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loginMutation.isPending}
              className="auth-button"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          <div className="auth-links">
            <Link href="/auth/register" className="auth-link">
              Don&apos;t have an account? Register
            </Link>
          </div>
        </form>
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
