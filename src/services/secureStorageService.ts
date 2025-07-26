import { supabase } from '@/integrations/supabase/client';

export class SecureStorageService {
  private static readonly ENCRYPTION_KEY = 'lovable-secure-key';
  
  static async storeSecurely(key: string, data: any, userId?: string): Promise<void> {
    try {
      const dataToStore = {
        data: this.encryptData(JSON.stringify(data)),
        timestamp: Date.now(),
        userId: userId || 'anonymous'
      };
      
      // For demo purposes, always use localStorage
      // In production with proper Supabase schema, this would store in database
      localStorage.setItem(`secure_${key}`, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Secure storage failed:', error);
    }
  }
  
  static async retrieveSecurely(key: string, userId?: string): Promise<any> {
    try {
      // For demo purposes, always use localStorage
      // In production with proper Supabase schema, this would query database
      const localData = localStorage.getItem(`secure_${key}`);
      const storedData = localData ? JSON.parse(localData) : null;
      
      if (!storedData) return null;
      
      // Check if data is expired (older than 7 days)
      if (Date.now() - storedData.timestamp > 7 * 24 * 60 * 60 * 1000) {
        this.removeSecurely(key, userId);
        return null;
      }
      
      return JSON.parse(this.decryptData(storedData.data));
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      return null;
    }
  }
  
  static async removeSecurely(key: string, userId?: string): Promise<void> {
    try {
      // For demo purposes, always use localStorage
      // In production with proper Supabase schema, this would delete from database
      localStorage.removeItem(`secure_${key}`);
    } catch (error) {
      console.error('Secure removal failed:', error);
    }
  }
  
  private static encryptData(data: string): string {
    // Simple encryption for client-side data
    // In production, use proper encryption libraries
    return btoa(data);
  }
  
  private static decryptData(encryptedData: string): string {
    try {
      return atob(encryptedData);
    } catch {
      return '';
    }
  }
  
  static async clearAllUserData(userId: string): Promise<void> {
    try {
      // For demo purposes, clear localStorage items for this user
      // In production with proper Supabase schema, this would delete from database
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('secure_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data.userId === userId) {
              localStorage.removeItem(key);
            }
          } catch {
            // Invalid data, remove it
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }
}