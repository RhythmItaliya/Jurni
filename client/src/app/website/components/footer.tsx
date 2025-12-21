'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="website-footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Logo variant="light" size="md" className="footer-brand-logo" />
            <p className="footer-tagline">
              Share your journey, connect with others, and explore the world
              through moments that matter.
            </p>
          </div>

          <div className="footer-social">
            {socialLinks.map(social => (
              <a
                key={social.label}
                href={social.href}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Jurni. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link href="/privacy" className="footer-bottom-link">
              Privacy
            </Link>
            <span className="footer-divider">•</span>
            <Link href="/terms" className="footer-bottom-link">
              Terms
            </Link>
            <span className="footer-divider">•</span>
            <Link href="/cookies" className="footer-bottom-link">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
