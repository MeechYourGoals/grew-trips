/**
 * Platform-agnostic sharing
 * Web: Uses Web Share API with fallback
 * Mobile: Would use native Share module
 */

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export interface ShareResult {
  success: boolean;
  error?: string;
}

class WebSharing {
  async canShare(options: ShareOptions): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }
    
    try {
      // Check if files are supported if files are provided
      if (options.files && options.files.length > 0) {
        return navigator.canShare?.({ files: options.files }) ?? false;
      }
      return true;
    } catch {
      return false;
    }
  }

  async share(options: ShareOptions): Promise<ShareResult> {
    try {
      if (!navigator.share) {
        // Fallback: copy to clipboard
        const shareText = [options.title, options.text, options.url]
          .filter(Boolean)
          .join('\n');
        
        await navigator.clipboard.writeText(shareText);
        return { success: true };
      }

      await navigator.share(options);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Share failed';
      console.error('Share error:', error);
      return { success: false, error: errorMessage };
    }
  }
}

export const platformSharing = new WebSharing();
