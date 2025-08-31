'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { logoutToHome } from '@/app/auth/logout';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Jurni Platform
            </h1>
            <p className="text-gray-600 mb-8">
              A modern platform built with Next.js and NestJS
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>

            <Link
              href="/auth/register"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Type assertion to access custom session properties
  const userSession = session as any;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {userSession?.user?.name || 'User'}!
            </h1>
            <button
              onClick={logoutToHome}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Out
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Your Account Info
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Username:</strong> {userSession?.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {userSession?.user?.email}
              </p>
              <p>
                <strong>User ID:</strong>{' '}
                {userSession?.user?.id || userSession?.user?.uuid || 'N/A'}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`font-medium ${userSession?.user?.isActive ? 'text-green-600' : 'text-red-600'}`}
                >
                  {userSession?.user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p>
                <strong>Created:</strong>{' '}
                {userSession?.user?.createdAt
                  ? new Date(userSession?.user?.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p>
                <strong>Last Updated:</strong>{' '}
                {userSession?.user?.updatedAt
                  ? new Date(userSession?.user?.updatedAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="text-center text-gray-500">
            <p>You are successfully authenticated!</p>
            <p className="mt-2">
              This is a simple authentication system with UUID-based user
              management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
