import axios from 'axios';
import { CLIENT_ENV } from '@/config/env';

const api = axios.create({
  baseURL: CLIENT_ENV.API_URL,
  timeout: CLIENT_ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from session storage (NextAuth handles this)
    if (typeof window !== 'undefined') {
      // Try to get token from various sources
      const token = localStorage.getItem('next-auth.session-token') || 
                   localStorage.getItem('__Secure-next-auth.session-token') ||
                   sessionStorage.getItem('next-auth.session-token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        // Clear all auth tokens
        localStorage.removeItem('next-auth.session-token');
        localStorage.removeItem('__Secure-next-auth.session-token');
        sessionStorage.removeItem('next-auth.session-token');
        
        // Redirect to signin page
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
