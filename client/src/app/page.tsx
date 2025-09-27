'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingPage } from '@/components/ui';

/**
 * Main home page component that handles automatic navigation based on authentication status
 * @returns {JSX.Element} Loading state while determining navigation
 */
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  /**
   * Handle automatic navigation based on authentication status
   * @param {string} status - Authentication status from NextAuth
   * @param {Object} session - User session data
   * @param {Object} router - Next.js router instance
   */
  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated' && session) {
      router.push('/dashboard');
      return;
    }
  }, [status, session, router]);

  return <LoadingPage />;
}
