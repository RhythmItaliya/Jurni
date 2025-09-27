import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import { QueryClientProviderWrapper } from '@/components/providers/QueryClientProvider';

export const metadata: Metadata = {
  title: 'Jurni - Full Stack App',
  description: 'Next.js + Nest.js + MongoDB application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryClientProviderWrapper>
          <SessionProvider>{children}</SessionProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
