import {
  LayoutConfig,
  routeLayoutConfig,
  defaultLayoutConfig,
} from '@/config/layout';

/**
 * Utility functions for managing layout configurations
 */
export class LayoutManager {
  private static instance: LayoutManager;
  private routeConfigs: Record<string, LayoutConfig>;

  private constructor() {
    this.routeConfigs = { ...routeLayoutConfig };
  }

  public static getInstance(): LayoutManager {
    if (!LayoutManager.instance) {
      LayoutManager.instance = new LayoutManager();
    }
    return LayoutManager.instance;
  }

  /**
   * Get layout configuration for a specific route
   */
  public getConfig(pathname: string): LayoutConfig {
    // Handle direct route matches
    if (this.routeConfigs[pathname]) {
      return this.routeConfigs[pathname];
    }

    // Handle dynamic profile routes
    if (this.isProfileRoute(pathname)) {
      return this.getProfileLayoutConfig(pathname);
    }

    return defaultLayoutConfig;
  }

  /**
   * Check if a pathname is a profile route
   */
  private isProfileRoute(pathname: string): boolean {
    // Matches: /[username], /[username]/edit, etc.
    const profilePattern = /^\/[^/]+(?:\/.*)?$/;
    // Exclude known non-profile routes
    const excludePatterns = [
      '/profile',
      '/trending',
      '/upload',
      '/auth',
      '/api',
    ];

    return (
      profilePattern.test(pathname) &&
      !excludePatterns.some(pattern => pathname.startsWith(pattern))
    );
  }

  /**
   * Get layout configuration for profile routes
   */
  private getProfileLayoutConfig(pathname: string): LayoutConfig {
    // Check if it's an edit route
    if (pathname.includes('/edit')) {
      return this.routeConfigs['profile-edit'] || defaultLayoutConfig;
    }

    // Default profile view layout
    return this.routeConfigs['profile-view'] || defaultLayoutConfig;
  }

  /**
   * Set layout configuration for a specific route
   */
  public setConfig(pathname: string, config: LayoutConfig): void {
    this.routeConfigs[pathname] = config;
  }

  /**
   * Update layout configuration for a specific route
   */
  public updateConfig(
    pathname: string,
    partialConfig: Partial<LayoutConfig>
  ): void {
    const currentConfig = this.getConfig(pathname);
    this.routeConfigs[pathname] = { ...currentConfig, ...partialConfig };
  }

  /**
   * Remove layout configuration for a specific route (will use default)
   */
  public removeConfig(pathname: string): void {
    delete this.routeConfigs[pathname];
  }

  /**
   * Get all route configurations
   */
  public getAllConfigs(): Record<string, LayoutConfig> {
    return { ...this.routeConfigs };
  }

  /**
   * Reset all configurations to default
   */
  public resetConfigs(): void {
    this.routeConfigs = { ...routeLayoutConfig };
  }

  /**
   * Check if a route shows a specific layout component
   */
  public showsLeftSidebar(pathname: string): boolean {
    return this.getConfig(pathname).showLeftSidebar;
  }

  public showsRightSidebar(pathname: string): boolean {
    return this.getConfig(pathname).showRightSidebar;
  }

  public showsMainContent(pathname: string): boolean {
    return this.getConfig(pathname).showMainContent;
  }

  public showsPosts(pathname: string): boolean {
    return this.getConfig(pathname).showPosts;
  }

  /**
   * Get layout type for a route
   */
  public getLayoutType(pathname: string): string {
    return this.getConfig(pathname).layoutType;
  }
}

// Export singleton instance
export const layoutManager = LayoutManager.getInstance();
