import { Haptics, ImpactStyle } from '@capacitor/haptics';

class HapticService {
  private isCapacitorAvailable = false;

  constructor() {
    // Check if we're running in a Capacitor environment
    this.isCapacitorAvailable = !!(window as any).Capacitor;
  }

  async light() {
    if (!this.isCapacitorAvailable) return;
    
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  async medium() {
    if (!this.isCapacitorAvailable) return;
    
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  async heavy() {
    if (!this.isCapacitorAvailable) return;
    
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  async success() {
    if (!this.isCapacitorAvailable) return;
    
    try {
      // Double light tap for success feeling
      await Haptics.impact({ style: ImpactStyle.Light });
      setTimeout(() => Haptics.impact({ style: ImpactStyle.Light }), 100);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  async celebration() {
    if (!this.isCapacitorAvailable) return;
    
    try {
      // Celebration pattern: medium, pause, light, light
      await Haptics.impact({ style: ImpactStyle.Medium });
      setTimeout(() => Haptics.impact({ style: ImpactStyle.Light }), 150);
      setTimeout(() => Haptics.impact({ style: ImpactStyle.Light }), 250);
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }
}

export const hapticService = new HapticService();