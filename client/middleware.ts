import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that are open to everyone
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth',
  '/about',
  '/contact',
];

// Routes that require authentication
const protectedRoutes = ['/@me', '/profile', '/settings', '/upload'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated (has session token)
  const hasSession =
    request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__Secure-next-auth.session-token');

  // Allow public routes (auth pages and website pages)
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect authenticated users from / to /@me
  if (pathname === '/' && hasSession) {
    return NextResponse.redirect(new URL('/@me', request.url));
  }

  // Redirect unauthenticated users from /@me to /
  if (pathname.startsWith('/@me') && !hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to website (/) if accessing protected route without session
  if (
    protectedRoutes.some(
      route => pathname === route || pathname.startsWith(route + '/')
    )
  ) {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect authenticated users away from auth pages to /@me
  if (hasSession && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/@me', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
