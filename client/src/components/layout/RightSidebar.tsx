'use client';

import { SuggestionsPanel } from '@/components/suggestions';

/**
 * Right sidebar component
 * Displays suggested users and trending hashtags
 * @returns {JSX.Element} Right sidebar layout component
 */
export default function RightSidebar() {
  return (
    <div className="right-sidebar">
      <div style={{ padding: '1rem' }}>
        <SuggestionsPanel />
      </div>
    </div>
  );
}
