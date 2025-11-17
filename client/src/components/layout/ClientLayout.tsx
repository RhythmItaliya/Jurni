'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingPage } from '@/components/ui';
import { DynamicLayout } from '@/components/layout';
import Home from '@/app/website/components';
import { RouteUtils } from '@/lib/routes';

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
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if current path is accessible to unauthenticated users
  const isAccessibleToUnauthenticated =
    RouteUtils.isAccessibleToUnauthenticated(pathname);

  useEffect(() => {
    // Don't redirect while loading
    if (status === 'loading') return;

    if (status === 'authenticated') {
      const redirectPath = RouteUtils.getAuthenticatedRedirect(pathname);
      if (redirectPath) {
        router.push(redirectPath);
        return;
      }
    }

    if (status === 'unauthenticated') {
      const redirectPath = RouteUtils.getUnauthenticatedRedirect(pathname);
      if (redirectPath) {
        router.push(redirectPath);
        return;
      }
    }
  }, [status, router, pathname]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return <LoadingPage />;
  }

  // For unauthenticated users, show a loading page while the effect performs
  // the redirect to the auth page. We must NOT call router.push during render
  // (that causes the React "setState in render" error). The useEffect below
  // will perform any needed redirects after the first render.
  if (status === 'unauthenticated' && RouteUtils.isProtectedRoute(pathname)) {
    if (!isRedirecting) {
      setIsRedirecting(true);
      setTimeout(() => router.push('/'), 2000);
    }
    return <LoadingPage />;
  }

  // Don't render anything while redirecting unauthenticated users
  if (status === 'unauthenticated') {
    // Show website pages without DynamicLayout (no sidebars)
    if (RouteUtils.shouldShowWebsiteLayout(pathname)) {
      return <Home />;
    }

    // Allow rendering of auth routes and username routes
    if (isAccessibleToUnauthenticated) {
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
