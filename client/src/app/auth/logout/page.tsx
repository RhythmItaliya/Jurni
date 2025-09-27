'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

/**
 * Logout page component for user session termination
 * @returns {JSX.Element} Loading state while logout is processing
 */
export default function LogoutPage() {
  const router = useRouter();

  /**
   * Perform logout immediately when component mounts
   * @param {Object} router - Next.js router instance
   */
  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut({
          redirect: false,
          callbackUrl: '/',
        });

        localStorage.removeItem('next-auth.session-token');
        localStorage.removeItem('__Secure-next-auth.session-token');
        sessionStorage.removeItem('next-auth.session-token');

        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/');
      }
    };

    performLogout();
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl mb-2">Logging out...</div>
        <div className="text-sm text-gray-500">Please wait</div>
      </div>
    </div>
  );
}
