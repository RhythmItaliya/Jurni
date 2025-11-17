import axios from 'axios';
import { CLIENT_ENV } from '@/config/env';

// Import NextAuth helpers only for client-side usage inside interceptors
// we import them at top-level but only call them when `window` is defined.
import { getSession, signOut } from 'next-auth/react';
import { RouteUtils } from '@/lib/routes';

const api = axios.create({
  baseURL: CLIENT_ENV.API_URL,
  timeout: CLIENT_ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async config => {
    // Only attempt to read client-side session/token in browser
    if (typeof window !== 'undefined') {
      try {
        // Try using NextAuth session first (recommended)
        const session = await getSession();
        const tokenFromSession = (() => {
          if (!session) return undefined;
          const s = session as unknown;
          if (typeof s === 'object' && s !== null) {
            const record = s as Record<string, unknown>;
            const t = record['accessToken'];
            return typeof t === 'string' ? t : undefined;
          }
          return undefined;
        })();

        const tokenFallback =
          localStorage.getItem('next-auth.session-token') ||
          localStorage.getItem('__Secure-next-auth.session-token') ||
          sessionStorage.getItem('next-auth.session-token');

        const token = tokenFromSession || tokenFallback;

        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.log('Error during signOut:', e);
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname || '/';

        // Clear any legacy storage tokens
        try {
          localStorage.removeItem('next-auth.session-token');
          localStorage.removeItem('__Secure-next-auth.session-token');
          sessionStorage.removeItem('next-auth.session-token');
        } catch (e) {
          console.log('Error clearing storage tokens:', e);
        }

        // If the current route is publicly accessible (for unauthenticated users)
        // (for example `/p/:id`) then DON'T automatically redirect to the login page.
        // This prevents pages like post detail from redirecting the user away
        // if a background request returned 401.
        try {
          if (RouteUtils.isAccessibleToUnauthenticated(pathname)) {
            // Do not redirect; let the calling code handle the error (UI can show a message)
            return Promise.reject(error);
          }
        } catch (e) {
          // If route util check somehow fails, fallback to previous behavior below
          console.log('RouteUtils check failed:', e);
        }

        // For protected routes, keep old behavior: sign out and redirect to login
        try {
          // Trigger NextAuth sign out to clear cookies and session
          await signOut({ redirect: false });
        } catch (e) {
          console.log('Error during signOut:', e);
        }

        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper function to create axios instance with custom base URL
export const createApiInstance = (customBaseURL?: string) => {
  return axios.create({
    baseURL: customBaseURL || CLIENT_ENV.API_URL,
    timeout: CLIENT_ENV.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
