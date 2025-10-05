/**
 * Platform-agnostic navigation utilities
 * Web: Uses react-router-dom
 * Mobile: Would use React Navigation
 */

export interface NavigationOptions {
  replace?: boolean;
  state?: any;
}

class WebNavigation {
  openURL(url: string, external = true): void {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  }

  canOpenURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  goBack(): void {
    window.history.back();
  }

  /**
   * Note: For actual navigation within the app, use useNavigate() from react-router-dom
   * This is just for platform-level navigation utilities
   */
}

export const platformNavigation = new WebNavigation();
