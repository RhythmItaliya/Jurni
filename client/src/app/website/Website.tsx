'use client';

import Link from 'next/link';
import React from 'react';

export default function Website() {
  return (
    <main
      className="website-landing"
      style={{ padding: '4rem', textAlign: 'center' }}
    >
      <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>
        Welcome to Jurni
      </h1>
      <p
        style={{
          fontSize: '1.125rem',
          color: '#555',
          maxWidth: 720,
          margin: '0 auto 2rem',
        }}
      >
        Jurni is a community-driven app for sharing short posts, following
        others, and discovering trending content. Create an account to start
        posting and connecting with others.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link
          href="/auth/register"
          className="btn btn-primary"
          style={{
            padding: '.75rem 1.25rem',
            borderRadius: 6,
            background: '#0b5fff',
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          Get started
        </Link>

        <Link
          href="/auth/login"
          className="btn"
          style={{
            padding: '.75rem 1.25rem',
            borderRadius: 6,
            border: '1px solid #ddd',
            color: '#111',
            textDecoration: 'none',
          }}
        >
          Sign in
        </Link>
      </div>

      <section style={{ marginTop: '3rem', color: '#666' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '.5rem' }}>Features</h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          <li>- Create and edit short posts</li>
          <li>- Follow users and view personalized feed</li>
          <li>- Trending topics and user profiles</li>
        </ul>
      </section>
    </main>
  );
}
