'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingPage } from '@/components/ui';

/**
 * Dashboard page component for authenticated users
 * Redirects unauthenticated users to login page
 * @returns {JSX.Element | null} The dashboard component or null if not authenticated
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    <div className="min-h-screen bg-white w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-charcoal mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl text-stone mb-8">
            Hello, {session.user?.username || session.user?.email}!
          </p>
        </div>
      </div>
    </div>
  );
}
