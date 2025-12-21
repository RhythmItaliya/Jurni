'use client';

import Hero from './hero';
import Features from './features';
import Services from './services';
import Footer from './footer';

export default function Home() {
  return (
    <main className="website-root">
      <div className="website-content">
        <Hero />
        <Features />
        <Services />
      </div>
      <Footer />
    </main>
  );
}
