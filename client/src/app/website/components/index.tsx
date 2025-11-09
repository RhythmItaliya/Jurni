'use client';

import { usePathname } from 'next/navigation';
import Header from './header';
import Hero from './hero';
import Features from './features';
import Services from './services';

export default function Home() {
  const pathname = usePathname();

  return (
    <main className="website-root">
      <Header />
      <div className="website-content">
        {pathname === '/' && (
          <>
            <Hero />
            <Features />
            <Services />
          </>
        )}
        {pathname === '/about' && (
          <div className="about-section">
            <h1>About Page - Test Route</h1>
          </div>
        )}
        {pathname === '/contact' && (
          <div className="contact-section">
            <h1>Contact Page - Test Route</h1>
          </div>
        )}
      </div>
    </main>
  );
}
