'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Perform logout immediately when component mounts
    const performLogout = async () => {
      try {
        // Sign out using NextAuth
        await signOut({
          redirect: false, // Don't redirect automatically
          callbackUrl: '/', // Set callback URL for manual redirect
        });

        // Clear any local storage or session storage if needed
        localStorage.removeItem('next-auth.session-token');
        localStorage.removeItem('__Secure-next-auth.session-token');
        sessionStorage.removeItem('next-auth.session-token');

        // Redirect to home page after logout
        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        // Even if there's an error, redirect to home
        router.push('/');
      }
    };

    performLogout();
  }, [router]);

  // Return minimal loading state while logout is processing
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl mb-2">Logging out...</div>
        <div className="text-sm text-gray-500">Please wait</div>
      </div>
    </div>
  );
}
