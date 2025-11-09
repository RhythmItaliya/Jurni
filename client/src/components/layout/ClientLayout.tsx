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

  // Public routes that should be accessible without authentication
  const publicPaths = new Set<string>([
    '/',
    '/about',
    '/contact',
    '/auth/login',
    '/auth/register',
    '/auth/verify-otp',
    '/auth/forgot-password',
    '/auth/reset-password',
  ]);

  const isPublicRoute =
    publicPaths.has(pathname) || pathname.startsWith('/auth/');

  useEffect(() => {
    // Don't redirect while loading
    if (status === 'loading') return;

    // Redirect authenticated users from / to /@me
    if (status === 'authenticated' && pathname === '/') {
      router.push('/@me');
      return;
    }

    // Redirect unauthenticated users from /@me to /
    if (status === 'unauthenticated' && pathname.startsWith('/@me')) {
      router.push('/');
      return;
    }

    // Redirect to home (/) only if route is protected (not public)
    if (status === 'unauthenticated' && !isPublicRoute) {
      router.push('/');
    }
  }, [status, router, pathname, isPublicRoute]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return <LoadingPage />;
  }

  // Don't render anything while redirecting unauthenticated users
  if (status === 'unauthenticated') {
    // Show website pages without DynamicLayout (no sidebars)
    if (pathname === '/' || pathname === '/about' || pathname === '/contact') {
      return <Home />;
    }

    // Allow rendering of auth routes
    if (pathname.startsWith('/auth/')) {
      return <>{children}</>;
    }

    // For protected pages we avoid rendering while redirecting
    return null;
  }

  // Authenticated users
  return (
    <>
      <DynamicLayout>{children}</DynamicLayout>
    </>
  );
}
