import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import { QueryClientProviderWrapper } from '@/components/providers/QueryClientProvider';
import ReduxProvider from '@/components/providers/ReduxProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastContainer } from '@/components/ui/Toast';
import { ClientLayout } from '@/components/layout';
import { montserrat, lora } from '@/lib/fonts';

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
    <html lang="en" dir="ltr">
      <head>
        <link rel="preload" href="/icons.svg" as="image" type="image/svg+xml" />
      </head>
      <body className={`${montserrat.variable} ${lora.variable} antialiased`}>
        <ThemeProvider>
          <ReduxProvider>
            <QueryClientProviderWrapper>
              <SessionProvider>
                <ClientLayout>{children}</ClientLayout>
                <ToastContainer />
              </SessionProvider>
            </QueryClientProviderWrapper>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
