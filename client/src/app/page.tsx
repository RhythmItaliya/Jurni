'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingPage } from '@/components/ui';
import { AppLayout } from '@/components/layout';

/**
 * Main home page component - only accessible to authenticated users
 * Redirects unauthenticated users to login page
 * @returns {JSX.Element} Loading state or main page content with layout
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

  return <AppLayout />;
}
