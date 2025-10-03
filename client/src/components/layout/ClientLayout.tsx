'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingPage } from '@/components/ui';
import { DynamicLayout } from '@/components/layout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side layout wrapper that handles authentication and dynamic layout
 * @param children - Page content to render
 * @returns Authenticated layout or loading/redirect states
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if already on auth page or if still loading
    if (status === 'loading' || pathname.startsWith('/auth/')) {
      return;
    }

    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router, pathname]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return <LoadingPage />;
  }

  // Don't render anything while redirecting unauthenticated users
  if (status === 'unauthenticated' && !pathname.startsWith('/auth/')) {
    return null;
  }

  return <DynamicLayout>{children}</DynamicLayout>;
}
