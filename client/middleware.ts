import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RouteUtils } from './src/lib/routes';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated (has session token)
  const hasSession =
    request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__Secure-next-auth.session-token') ||
    request.cookies.has('next-auth.session-token.0') ||
    request.cookies.has('__Secure-next-auth.session-token.0') ||
    request.cookies.has('next-auth.callback-url') ||
    request.cookies.has('__Secure-next-auth.callback-url');

  // Allow public routes (auth pages and website pages)
  if (RouteUtils.isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Allow username routes (single segment paths that are not protected)
  if (RouteUtils.isUsernameRoute(pathname)) {
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

  // Redirect to auth page if accessing protected route without session
  if (RouteUtils.isProtectedRoute(pathname)) {
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
