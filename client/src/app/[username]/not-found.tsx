import Link from 'next/link';

/**
 * Not found page for invalid profile routes
 * @returns {JSX.Element} 404 page content
 */
export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Profile Not Found</h2>
          <p>Sorry, we couldn&apos;t find the profile you&apos;re looking for.</p>
          <p>
            The user might have changed their username or the profile may no
            longer exist.
          </p>
          <div className="not-found-actions">
            <Link href="/" className="btn-primary">
              Go Home
            </Link>
            <Link href="/trending" className="btn-secondary">
              Explore Trending
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
