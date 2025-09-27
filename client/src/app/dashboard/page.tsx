'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingPage } from '@/components/ui';
import { useReduxToast } from '@/hooks/useReduxToast';

/**
 * Dashboard page component for authenticated users
 * Redirects unauthenticated users to login page
 * @returns {JSX.Element | null} The dashboard component or null if not authenticated
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showSuccess, showError } = useReduxToast();

  /**
   * Redirect unauthenticated users to login page
   * @param {string} status - Authentication status from useSession
   * @param {Object} router - Next.js router instance
   */
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LoadingPage />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={() => {
                showSuccess(
                  'Logged Out',
                  'You have been successfully logged out'
                );
                signOut({ callbackUrl: '/auth/login' });
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-800">
              Welcome back,{' '}
              <strong>{session.user?.username || session.user?.email}</strong>!
            </p>
            <p className="text-green-700 text-sm mt-1">
              This is a protected route. You can only see this if you're logged
              in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Protected Content</h3>
              <p className="text-blue-700 text-sm mt-2">
                This content is only visible to authenticated users.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">User Info</h3>
              <p className="text-purple-700 text-sm mt-2">
                Email: {session.user?.email}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900">Session Status</h3>
              <p className="text-orange-700 text-sm mt-2">Status: {status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
