import { signOut } from 'next-auth/react';

/**
 * Utility function to handle user logout
 * Clears NextAuth session and redirects to specified URL
 */
export const handleLogout = async (callbackUrl: string = '/') => {
  try {
    await signOut({
      redirect: true,
      callbackUrl,
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem('next-auth.session-token');
      localStorage.removeItem('__Secure-next-auth.session-token');
      sessionStorage.removeItem('next-auth.session-token');
    }
  } catch (error) {
    console.error('Logout error:', error);
    if (typeof window !== 'undefined') {
      window.location.href = callbackUrl;
    }
  }
};

/**
 * Logout and redirect to home page
 */
export const logoutToHome = () => handleLogout('/');

/**
 * Logout and redirect to login page
 */
export const logoutToLogin = () => handleLogout('/auth/login');

/**
 * Logout and redirect to custom URL
 */
export const logoutToUrl = (url: string) => handleLogout(url);
