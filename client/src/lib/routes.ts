/**
 * Centralized Route Configuration
 * Defines all route types and permissions for consistent management
 * Used by both middleware.ts and ClientLayout.tsx
 */

// Routes that are open to everyone (no authentication required)
export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/auth/login',
  '/auth/register',
  '/auth/verify-otp',
  '/auth/forgot-password',
  '/auth/reset-password',

  '/admin/login',
  '/admin/register',
  '/admin',

  '/p',
  '/h',
  '/j',
] as const;

// API routes that are public
export const PUBLIC_API_ROUTES = ['/api/auth'] as const;

// Routes that require authentication
export const PROTECTED_ROUTES = [
  '/@me',
  '/profile',
  '/settings',
  '/upload',
  '/trending',
  '/search',
] as const;

// Route type checkers
export const RouteUtils = {
  /**
   * Check if a path is a public route
   * @param pathname - The URL path to check
   * @returns true if the path is publicly accessible without authentication
   */
  isPublicRoute: (pathname: string): boolean => {
    return (
      PUBLIC_ROUTES.some(route => pathname.startsWith(route)) ||
      PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))
    );
  },

  /**
   * Check if a path is a protected route
   * @param pathname - The URL path to check
   * @returns true if the path requires authentication to access
   */
  isProtectedRoute: (pathname: string): boolean => {
    return PROTECTED_ROUTES.some(
      route => pathname === route || pathname.startsWith(route + '/')
    );
  },

  /**
   * Check if a path is a username route (public profile pages)
   * Username routes are single-segment paths that don't match other patterns
   * Only allows paths like /username, not /username/post or /username/something/else
   * @param pathname - The URL path to check
   * @returns true if the path is a public user profile page (e.g., /username)
   */
  isUsernameRoute: (pathname: string): boolean => {
    return (
      RouteUtils.isValidUsernameRoute(pathname) &&
      !RouteUtils.isPublicRoute(pathname) && // Not explicitly public
      !RouteUtils.isProtectedRoute(pathname)
    ); // Not protected
  },

  /**
   * Check if a path is accessible to unauthenticated users
   * @param pathname - The URL path to check
   * @returns true if unauthenticated users can access this route
   */
  isAccessibleToUnauthenticated: (pathname: string): boolean => {
    return (
      RouteUtils.isPublicRoute(pathname) ||
      RouteUtils.isUsernameRoute(pathname) ||
      pathname.startsWith('/auth/') ||
      pathname.startsWith('/p/')
    );
  },

  /**
   * Validate if a path is a valid username route format
   * @param pathname - The URL path to check
   * @returns true if the path follows username route format (/j/username)
   */
  isValidUsernameRoute: (pathname: string): boolean => {
    // Must start with /j/ and contain exactly two segments: /j/username
    const parts = pathname.split('/');
    return (
      pathname.startsWith('/j/') &&
      parts.length === 3 &&
      parts[1] === 'j' &&
      parts[2].length > 0 &&
      !parts[2].startsWith('@') &&
      !pathname.startsWith('/j/auth/') &&
      !pathname.startsWith('/j/api/')
    );
  },

  /**
   * Check if a path should show website layout (no sidebars)
   * @param pathname - The URL path to check
   * @returns true if the path should display the website layout without navigation sidebars
   */
  shouldShowWebsiteLayout: (pathname: string): boolean => {
    return pathname === '/' || pathname === '/about' || pathname === '/contact';
  },

  /**
   * Check if a path should show auth layout
   * @param pathname - The URL path to check
   * @returns true if the path is an authentication-related page
   */
  shouldShowAuthLayout: (pathname: string): boolean => {
    return (
      pathname.startsWith('/auth/') ||
      pathname.startsWith('/admin/login') ||
      pathname.startsWith('/admin/register')
    );
  },

  /**
   * Check if a path should show profile layout
   * @param pathname - The URL path to check
   * @returns true if the path is a user profile page that should show profile-specific layout
   */
  shouldShowProfileLayout: (pathname: string): boolean => {
    return RouteUtils.isUsernameRoute(pathname);
  },

  /**
   * Check if a path should show dynamic layout (with sidebars)
   * @param pathname - The URL path to check
   * @returns true if the path should display the main app layout with navigation sidebars
   */
  shouldShowDynamicLayout: (pathname: string): boolean => {
    return (
      !RouteUtils.shouldShowWebsiteLayout(pathname) &&
      !RouteUtils.shouldShowAuthLayout(pathname) &&
      !RouteUtils.shouldShowProfileLayout(pathname)
    );
  },

  /**
   * Get redirect path for authenticated users
   * Returns null if no redirect needed
   * @param pathname - The current URL path
   * @returns redirect path string or null if no redirect is needed
   */
  getAuthenticatedRedirect: (pathname: string): string | null => {
    // Redirect authenticated users from / to /@me
    if (pathname === '/') {
      return '/@me';
    }
    return null;
  },

  /**
   * Get redirect path for unauthenticated users
   * Returns null if no redirect needed
   * @param pathname - The current URL path
   * @returns redirect path string or null if no redirect is needed
   */
  getUnauthenticatedRedirect: (pathname: string): string | null => {
    // Redirect unauthenticated users from /@me to /
    if (pathname.startsWith('/@me')) {
      return '/';
    }

    // Redirect to auth page if route is protected (not accessible to unauthenticated users)
    if (!RouteUtils.isAccessibleToUnauthenticated(pathname)) {
      return '/';
    }

    return null;
  },
} as const;

// Export types for TypeScript
export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
