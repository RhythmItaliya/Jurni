'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingPage } from '@/components/ui';

/**
 * Main home page component - only accessible to authenticated users
 * Redirects unauthenticated users to login page
 * @returns {JSX.Element} Loading state or main page content
 */
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  /**
   * Redirect unauthenticated users to login page
   * @param {string} status - Authentication status from NextAuth
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
            Welcome to Jurni
          </h1>
          <p className="text-xl text-stone mb-8">
            Hello, {session.user?.username || session.user?.email}!
          </p>
        </div>
      </div>
    </div>
  );
}
