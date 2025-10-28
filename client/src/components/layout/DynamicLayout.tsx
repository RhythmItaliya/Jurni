'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { layoutManager } from '@/lib/layoutManager';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MainContentArea from './MainContentArea';

interface DynamicLayoutProps {
  children?: React.ReactNode;
}

/**
 * Dynamic layout component that shows different layout combinations based on route
 *
 * IMPORTANT: Layout structure is consistent, content varies:
 * - showLeftSidebar = Navigation sidebar (always contains navigation)
 * - showRightSidebar = Empty layout sidebar (NO content, just layout structure)
 * - showMainContent = Main content area (ALWAYS same size when true)
 * - showPosts = Whether to show posts or blank area in main content
 * - Page content = Individual page content (shown in blank main content)
 *
 * @param children - Page content to render in the main area
 * @returns Layout with appropriate sidebars based on route configuration
 */
export default function DynamicLayout({ children }: DynamicLayoutProps) {
  const pathname = usePathname();

  const layoutConfig = useMemo(
    () => layoutManager.getConfig(pathname),
    [pathname]
  );

  // Extract user information for profile routes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _userData = useMemo(() => {
    // For /[username] routes, extract username
    const profileMatch = pathname.match(/^\/([^/]+)(?:\/.*)?$/);
    if (
      profileMatch &&
      !['profile', 'trending', 'upload', 'auth', 'api'].includes(
        profileMatch[1]
      )
    ) {
      return {
        username: profileMatch[1],
        // For now, we'll use the username as userId - in a real app, you'd fetch the actual user ID
        userId: profileMatch[1], // This should be replaced with actual user ID lookup
      };
    }

    // For /profile route, we'd get the current user's data from session
    if (pathname === '/profile') {
      // TODO: Get current user's data from session
      return {
        username: 'currentUser', // Placeholder
        userId: 'currentUserId', // Placeholder
      };
    }

    return null;
  }, [pathname]);

  // Skip layout for auth pages
  if (pathname.startsWith('/auth/')) {
    return <>{children}</>;
  }

  return (
    <div className={`app-layout layout-${layoutConfig.layoutType}`}>
      {/* LEFT SIDEBAR - Navigation (when true, shows navigation menu) */}
      {layoutConfig.showLeftSidebar && <LeftSidebar />}

      {/* MAIN CONTENT AREA - Always same size, content varies based on showPosts */}
      {layoutConfig.showMainContent && (
        <MainContentArea showPosts={layoutConfig.showPosts}>
          {!layoutConfig.showPosts && children}
        </MainContentArea>
      )}

      {/* PAGE CONTENT - Individual page content (when MainContent is false) */}
      {!layoutConfig.showMainContent && (
        <div className="page-content">{children}</div>
      )}

      {/* RIGHT SIDEBAR - Layout only (when true, shows empty sidebar for layout structure) */}
      {layoutConfig.showRightSidebar && <RightSidebar />}
    </div>
  );
}
