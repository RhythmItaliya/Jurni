import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  return (
    <header className="website-header">
      <div className="container header-inner">
        <div className="header-left">
          <Link href="/" className="auth-logo-placeholder">
            Jurni
          </Link>
        </div>

        <div className="header-center">
          <nav className="site-nav">
            <Link href="/contact">Contact</Link>
            <Link href="/about">About</Link>
            <Link href="/website/vision">Our Vision</Link>
            <Link href="/auth/login">Sign In</Link>
            <Link href="/auth/register">Sign Up</Link>
          </nav>
        </div>

        <div className="header-right">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
