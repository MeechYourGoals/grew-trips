import { supabase } from '../integrations/supabase/client';

export interface NotificationPreference {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  tripUpdates: boolean;
  chatMessages: boolean;
  calendarReminders: boolean;
  paymentAlerts: boolean;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
}

export interface PushToken {
  id: string;
  userId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  createdAt: Date;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class NotificationService {
  private serviceWorker: ServiceWorkerRegistration | null = null;

  async initialize() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.serviceWorker = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribeToPush(userId: string): Promise<string | null> {
    if (!this.serviceWorker) {
      await this.initialize();
    }

    if (!this.serviceWorker) {
      console.error('Service Worker not available');
      return null;
    }

    try {
      const subscription = await this.serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          // This would be your VAPID public key
          'your-vapid-public-key'
        )
      });

      const token = JSON.stringify(subscription);
      
      // Save token to database
      await this.savePushToken(userId, token, 'web');
      
      return token;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  async savePushToken(userId: string, token: string, platform: 'ios' | 'android' | 'web') {
    try {
      // Mock implementation until database tables are available
      console.log('Push token saved:', { userId, platform, token: token.slice(0, 20) + '...' });
      return true;
    } catch (error) {
      console.error('Error saving push token:', error);
      return false;
    }
  }

  async getNotificationPreferences(userId: string): Promise<NotificationPreference | null> {
    try {
      // Mock implementation until database tables are available
      return {
        userId,
        pushEnabled: true,
        emailEnabled: true,
        smsEnabled: false,
        tripUpdates: true,
        chatMessages: true,
        calendarReminders: true,
        paymentAlerts: true,
        quietHoursEnabled: false,
        quietStart: '22:00',
        quietEnd: '08:00'
      };
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return null;
    }
  }

  async updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreference>) {
    try {
      // Mock implementation until database tables are available
      console.log('Notification preferences updated:', { userId, preferences });
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }

  async sendLocalNotification(payload: NotificationPayload) {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/chravel-logo.png',
        badge: payload.badge || '/chravel-logo.png',
        data: payload.data,
        requireInteraction: true
      });

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        if (payload.data?.url) {
          window.open(payload.data.url, '_self');
        }
      };

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  async sendPushNotification(userId: string, payload: NotificationPayload) {
    try {
      console.log('[Demo] sendPushNotification', { userId, payload });
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  async sendEmailNotification(userId: string, subject: string, content: string) {
    try {
      console.log('[Demo] sendEmailNotification', { userId, subject });
      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  async sendSMSNotification(userId: string, message: string) {
    try {
      console.log('[Demo] sendSMSNotification', { userId });
      return true;
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      return false;
    }
  }

  // Utility methods
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  isQuietHours(preferences: NotificationPreference): boolean {
    if (!preferences.quietHoursEnabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const startTime = parseInt(preferences.quietStart.replace(':', ''));
    const endTime = parseInt(preferences.quietEnd.replace(':', ''));

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime < endTime;
    } else {
      return currentTime >= startTime || currentTime < endTime;
    }
  }

  async unsubscribe(userId: string) {
    try {
      console.log('Unsubscribing user:', userId);
      
      // Unsubscribe from service worker
      if (this.serviceWorker) {
        const subscription = await this.serviceWorker.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    }
  }
}

export const notificationService = new NotificationService();