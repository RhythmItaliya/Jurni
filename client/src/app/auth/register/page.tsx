'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { validateRegisterForm, formatRegisterError } from './register';
import { LoadingPage } from '@/components/ui';
import { RegisterData } from '@/types/user';
import { useRegister } from '@/hooks/useAuth';

/**
 * Registration page component for creating new user accounts
 * @returns {JSX.Element} The registration form component with loading state
 */
export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [updateMessage, setUpdateMessage] = useState('');
  const [originalData, setOriginalData] = useState<{
    email: string;
    username: string;
  } | null>(null);

  const registerMutation = useRegister();

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

      setOriginalData({
        email: decodedEmail,
        username: decodedUsername,
      });
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

    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      return;
    }

    if (originalData) {
      setUpdateMessage('Account details updated successfully!');
    }

    registerMutation.mutate(formData);
  };

  if (registerMutation.isPending) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
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
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {updateMessage && (
            <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
              {updateMessage}
            </div>
          )}

          {registerMutation.error && (
            <div className="text-red-600 text-sm text-center">
              {formatRegisterError(
                registerMutation.error.message || 'Registration failed'
              )}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {registerMutation.isPending
                ? 'Creating account...'
                : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
