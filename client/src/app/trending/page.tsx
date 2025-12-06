/**
 * Trending page component - shows trending posts and content
 * Layout: Left Sidebar (navigation) + Right Sidebar (layout only) + This page content
 * NO posts from MainContent - this is separate page content
 * @returns {JSX.Element} Trending page content
 */
'use client';
import React from 'react';
import { TrendingHeader, TrendingContent } from '@/components/trending';

export default function TrendingPage() {
  return (
    <div className="trending-page">
      <div className="container">
        <TrendingHeader
          title="Trending"
          subtitle="Discover what's hot right now"
          totalPosts={1200}
          totalTopics={89}
          totalViews={2100000}
          totalUsers={450}
        />

        <TrendingContent />
      </div>
    </div>
  );
}
