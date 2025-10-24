'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingPage } from '@/components/ui';
import { DynamicLayout } from '@/components/layout';
import Home from '@/app/website/components';

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

    // Redirect to login if not authenticated and not on root
    if (status === 'unauthenticated' && pathname !== '/') {
      router.push('/auth/login');
    }
  }, [status, router, pathname]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return <LoadingPage />;
  }

  // Don't render anything while redirecting unauthenticated users
  if (status === 'unauthenticated') {
    // If user is on root, show marketing/website landing page
    if (pathname === '/') {
      return <Home />;
    }

    // For other pages (except auth) we avoid rendering while redirecting
    if (!pathname.startsWith('/auth/')) {
      return null;
    }
  }

  return (
    <>
      <DynamicLayout>{children}</DynamicLayout>
    </>
  );
}
