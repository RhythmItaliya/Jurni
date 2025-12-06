'use client';

/**
 * Right sidebar component - pure layout component
 * This is ONLY for layout structure, contains NO posts or content
 * Just provides the right sidebar visual structure
 * @returns {JSX.Element} Right sidebar layout component
 */
export default function RightSidebar() {
  return (
    <div className="right-sidebar">
      <div className="sidebar-placeholder">
        {/* You can add layout-only elements here if needed */}
        {/* Like suggested users, trends, etc. - but NO posts */}
      </div>
    </div>
  );
}
