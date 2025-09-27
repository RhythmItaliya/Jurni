'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Handle logout with custom redirect
 */
export const handleLogout = async (redirectTo?: string) => {
  try {
    await signOut({
      redirect: false,
      callbackUrl: redirectTo || '/',
    });

    // Clear any local storage or session storage
    localStorage.removeItem('next-auth.session-token');
    localStorage.removeItem('__Secure-next-auth.session-token');
    sessionStorage.removeItem('next-auth.session-token');

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error };
  }
};

/**
 * Logout and redirect to home page
 */
export const logoutToHome = async () => {
  return handleLogout('/');
};

/**
 * Logout and redirect to login page
 */
export const logoutToLogin = async () => {
  return handleLogout('/auth/login');
};

/**
 * Logout and redirect to custom URL
 */
export const logoutToUrl = async (url: string) => {
  return handleLogout(url);
};
