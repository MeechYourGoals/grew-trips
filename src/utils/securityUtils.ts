// Input validation and sanitization utilities
export class InputValidator {
  // Sanitize string input to prevent XSS
  static sanitizeText(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .substring(0, 1000); // Limit length
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  }

  // Validate and sanitize search queries
  static sanitizeSearchQuery(query: string): string {
    if (typeof query !== 'string') return '';
    
    return query
      .replace(/[<>'"]/g, '')
      .replace(/[;(){}[\]]/g, '') // Remove SQL injection characters
      .trim()
      .substring(0, 200);
  }

  // Validate URL format
  static isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  // Sanitize HTML content for display
  static sanitizeHtml(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  // Validate trip ID format
  static isValidTripId(id: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(id) && id.length > 0 && id.length <= 50;
  }

  // Rate limiting check (simple client-side implementation)
  private static requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  
  static checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const existing = this.requestCounts.get(identifier);
    
    if (!existing || now > existing.resetTime) {
      this.requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (existing.count >= maxRequests) {
      return false;
    }
    
    existing.count++;
    return true;
  }
}

// Content Security Policy helper
export class CSPHelper {
  static createSecureStyleElement(css: string): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = css;
    return style;
  }
  
  static sanitizeInlineStyles(styles: Record<string, string>): Record<string, string> {
    const safe: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(styles)) {
      // Only allow safe CSS properties
      if (this.isSafeCSSProperty(key) && this.isSafeCSSValue(value)) {
        safe[key] = value;
      }
    }
    
    return safe;
  }
  
  private static isSafeCSSProperty(property: string): boolean {
    const safeProperties = [
      'color', 'background-color', 'font-size', 'font-weight', 'margin', 'padding',
      'border', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom'
    ];
    return safeProperties.includes(property);
  }
  
  private static isSafeCSSValue(value: string): boolean {
    // Block javascript and data URLs
    return !value.toLowerCase().includes('javascript:') && 
           !value.toLowerCase().includes('data:') &&
           !value.includes('<') &&
           !value.includes('>');
  }
}