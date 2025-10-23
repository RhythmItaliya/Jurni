import Link from 'next/link';

export default function Hero() {
  return (
    <section className="website-hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <h1 className="hero-title">
            Create, share and discover meaningful posts
          </h1>
          <p className="hero-sub">
            Jurni helps writers, creators and thinkers publish short-form
            stories and connect with like-minded people. Start your journey —
            it's free and easy.
          </p>

          <div className="hero-ctas">
            <Link href="/auth/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/website/vision" className="btn btn-secondary">
              Learn more
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="visual-placeholder">Illustration</div>
        </div>
      </div>
    </section>
  );
}
