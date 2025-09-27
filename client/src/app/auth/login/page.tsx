'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { validateLoginForm } from './login';
import { LoginCredentials } from '@/types/user';
import { LoadingPage, Input } from '@/components/ui';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {message && (
          <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded">
            {message}
          </div>
        )}

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          suppressHydrationWarning
        >
          <div className="space-y-4">
            <div>
              <Input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username or Email address"
                value={formData.usernameOrEmail}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/register"
              className="text-indigo-600 hover:text-indigo-500"
            >
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
