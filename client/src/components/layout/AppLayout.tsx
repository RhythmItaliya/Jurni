'use client';

import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MainContent from './MainContent';

/**
 * Main application layout with three-column design
 * Similar to Twitter/Instagram layout with left sidebar, main content, and right sidebar
 * @returns {JSX.Element} Three-column layout component
 */
export default function AppLayout() {
  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <MainContent />

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
