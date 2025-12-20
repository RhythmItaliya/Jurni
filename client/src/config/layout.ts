// Layout configuration for different routes
export interface LayoutConfig {
  showLeftSidebar: boolean; // Show left navigation sidebar
  showRightSidebar: boolean; // Show right layout sidebar (just layout, no content)
  showMainContent: boolean; // Show main content area (always same size)
  showPosts: boolean; // Show actual posts in main content (only for home)
  showCommentsPanel?: boolean; // Whether to enable comments side panel in this layout
  layoutType: 'full' | 'sidebar-only' | 'minimal';
  mainContentFullWidth?: boolean; // Allow main content to use full width instead of max 600px
}

// Define which layout components to show on each route
export const routeLayoutConfig: Record<string, LayoutConfig> = {
  '/': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: true, // Layout sidebar (empty, just for layout)
    showMainContent: true, // Main content area (same size always)
    showPosts: true, // Show actual posts in main content
    showCommentsPanel: true, // Enable comments side panel
    layoutType: 'full',
  },

  '/p/edit/*': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: false, // No right sidebar
    showMainContent: true, // Main content area (same size always)
    showPosts: false, // Show page content, not posts feed
    showCommentsPanel: true, // Enable comments side panel
    layoutType: 'sidebar-only',
    mainContentFullWidth: false, // Use default width for centering
  },

  '/p/h/*': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: true, // Layout sidebar (empty, just for layout)
    showMainContent: true, // Main content area (same size always)
    showCommentsPanel: true, // Enable comments side panel
    layoutType: 'sidebar-only',

    showPosts: false, // Show page content, not posts feed
    mainContentFullWidth: false, // Use default width for centering
  },

  '/p/l/*': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: true, // Layout sidebar (empty, just for layout)
    showMainContent: true, // Main content area (same size always)
    showCommentsPanel: true, // Enable comments side panel
    layoutType: 'sidebar-only',
    showPosts: false, // Show page content, not posts feed
    mainContentFullWidth: false, // Use default width for centering
  },

  '/j/*': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: true, // Show right sidebar for followers/following
    showMainContent: true, // Use main content area for full width layout
    showPosts: false, // No posts, just page content inside main area
    layoutType: 'full',
    mainContentFullWidth: true, // Allow full width in main content area
  },

  '/p/*': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: true, // No right sidebar
    showMainContent: true, // Main content area (same size always)
    showPosts: false, // Show page content, not posts feed
    showCommentsPanel: true, // Enable comments side panel
    layoutType: 'sidebar-only',
    mainContentFullWidth: false, // Use default width for centering
  },

  '/profile': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: true, // Show right sidebar for followers/following
    showMainContent: true, // Use main content area for full width layout
    showPosts: false, // No posts, just page content inside main area
    layoutType: 'full',
    mainContentFullWidth: true, // Allow full width in main content area
  },

  '/trending': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: false, // No right sidebar
    showMainContent: true, // Use main content area for full width layout
    showPosts: false, // No posts, just page content inside main area
    layoutType: 'sidebar-only',
    mainContentFullWidth: true, // Allow full width in main content area
  },

  '/upload': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: false, // No right sidebar
    showMainContent: true, // Use main content area for full width layout
    showPosts: false, // No posts, just page content inside main area
    layoutType: 'sidebar-only',
    mainContentFullWidth: true, // Allow full width in main content area
  },

  '/search': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: false, // No right sidebar
    showMainContent: true, // Use main content area for full width layout
    showPosts: false, // No posts, just page content inside main area
    layoutType: 'sidebar-only',
    mainContentFullWidth: true, // Allow full width in main content area
  },

  '/profile/edit': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: false, // No right sidebar
    showMainContent: true, // Use main content area for full width layout
    showPosts: false, // No posts, just page content inside main area
    layoutType: 'sidebar-only',
    mainContentFullWidth: true, // Allow full width in main content area
  },

  // Dynamic profile routes
  'profile-view': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: true, // Layout sidebar (empty, just for layout)
    showMainContent: true, // Main content area (same size, but empty)
    showPosts: true, // Show user's posts
    showCommentsPanel: true, // Enable comments side panel
    layoutType: 'full',
  },
  'profile-edit': {
    showLeftSidebar: true, // Navigation sidebar
    showRightSidebar: false, // No right sidebar
    showMainContent: true, // Main content area (same size, but empty)
    showPosts: false, // No posts, just blank area
    layoutType: 'sidebar-only',
  },
};

// Default layout config for routes not explicitly defined
export const defaultLayoutConfig: LayoutConfig = {
  showLeftSidebar: true,
  showRightSidebar: false,
  showMainContent: true, // Always show main content area
  showPosts: false, // But no posts by default
  layoutType: 'sidebar-only',
};

/**
 * Get layout configuration for a specific route
 * @param pathname - Current route pathname
 * @returns Layout configuration object
 */
export function getLayoutConfig(pathname: string): LayoutConfig {
  // Handle direct route matches
  if (routeLayoutConfig[pathname]) {
    return routeLayoutConfig[pathname];
  }

  // Handle dynamic profile routes
  if (isProfileRoute(pathname)) {
    return getProfileLayoutConfig(pathname);
  }

  return defaultLayoutConfig;
}

/**
 * Check if a pathname is a profile route
 * @param pathname - Current route pathname
 * @returns boolean indicating if it's a profile route
 */
export function isProfileRoute(pathname: string): boolean {
  // Matches: /[username], /[username]/edit, etc.
  const profilePattern = /^\/[^/]+(?:\/.*)?$/;
  // Exclude known non-profile routes
  const excludePatterns = ['/profile', '/trending', '/upload', '/auth', '/api'];

  return (
    profilePattern.test(pathname) &&
    !excludePatterns.some(pattern => pathname.startsWith(pattern))
  );
}

/**
 * Get layout configuration for profile routes
 * @param pathname - Profile route pathname
 * @returns Layout configuration for profile routes
 */
export function getProfileLayoutConfig(pathname: string): LayoutConfig {
  // Check if it's an edit route
  if (pathname.includes('/edit')) {
    return routeLayoutConfig['profile-edit'];
  }

  // Default profile view layout
  return routeLayoutConfig['profile-view'];
}
