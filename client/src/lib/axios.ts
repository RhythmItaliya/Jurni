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
  config => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('next-auth.session-token') ||
        localStorage.getItem('__Secure-next-auth.session-token') ||
        sessionStorage.getItem('next-auth.session-token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('next-auth.session-token');
        localStorage.removeItem('__Secure-next-auth.session-token');
        sessionStorage.removeItem('next-auth.session-token');
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
