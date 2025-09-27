'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { validateRegisterForm } from './register';
import { LoadingPage, Input } from '@/components/ui';
import { RegisterData } from '@/types/user';
import { useRegister } from '@/hooks/useAuth';
import { useToastContext } from '@/components/providers/ToastProvider';

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
  const [originalData, setOriginalData] = useState<{
    email: string;
    username: string;
  } | null>(null);

  const registerMutation = useRegister();
  const { showSuccess, showError } = useToastContext();

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
      onError: error => {
        const serverMessage =
          (error as any)?.response?.data?.message ||
          (error as any)?.response?.data?.error ||
          (error as any)?.response?.data ||
          error?.message;
        showError('Registration Failed', serverMessage);
      },
    });
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
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          suppressHydrationWarning
        >
          <div className="space-y-4">
            <div>
              <Input
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
              <Input
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
            <div>
              <Input
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
