'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { layoutManager } from '@/lib/layoutManager';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MainContent from './MainContent';
import MoreSidebar from './MoreSidebar';

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
  const [showMoreSidebar, setShowMoreSidebar] = useState(false);

  const layoutConfig = useMemo(
    () => layoutManager.getConfig(pathname),
    [pathname]
  );

  // Skip layout for auth pages
  if (pathname.startsWith('/auth/')) {
    return <>{children}</>;
  }

  return (
    <div className={`app-layout layout-${layoutConfig.layoutType}`}>
      {/* LEFT SIDEBAR - Navigation (when true, shows navigation menu) */}
      {layoutConfig.showLeftSidebar && (
        <LeftSidebar
          onMoreToggle={() => setShowMoreSidebar(!showMoreSidebar)}
        />
      )}

      {/* MORE SIDEBAR - Additional options */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{
          x: showMoreSidebar ? 0 : -100,
          opacity: showMoreSidebar ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {showMoreSidebar && (
          <MoreSidebar onClose={() => setShowMoreSidebar(false)} />
        )}
      </motion.div>

      {/* MAIN CONTENT AREA - Always same size, content varies based on showPosts */}
      {layoutConfig.showMainContent && (
        <MainContent
          showPosts={layoutConfig.showPosts}
          fullWidth={layoutConfig.mainContentFullWidth}
        >
          {!layoutConfig.showPosts && children}
        </MainContent>
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
