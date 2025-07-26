import { supabase } from '@/integrations/supabase/client';

export class AuthService {
  static async verifyTripAccess(tripId: string, userId: string): Promise<boolean> {
    try {
      // For demo purposes, use localStorage to check trip access
      // In production, this would query the database
      const userTrips = JSON.parse(localStorage.getItem(`user_trips_${userId}`) || '[]');
      return userTrips.includes(tripId);
    } catch (error) {
      console.error('Trip access verification failed:', error);
      return false;
    }
  }

  static async verifyResourceOwnership(resourceType: string, resourceId: string, userId: string): Promise<boolean> {
    try {
      // For demo purposes, use localStorage to check ownership
      // In production, this would query the database
      const userResources = JSON.parse(localStorage.getItem(`user_${resourceType}_${userId}`) || '[]');
      return userResources.includes(resourceId);
    } catch (error) {
      console.error('Resource ownership verification failed:', error);
      return false;
    }
  }

  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    // Remove potential XSS vectors
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
      .slice(0, 1000); // Limit length
  }

  static validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const allowedProtocols = ['http:', 'https:'];
      const blockedDomains = ['javascript', 'data', 'file', 'ftp'];
      
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return false;
      }
      
      if (blockedDomains.some(domain => urlObj.hostname.includes(domain))) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }
}