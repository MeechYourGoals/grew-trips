/**
 * Synchronous utility to check demo mode status
 * Used for initial state and conditional imports
 */
import { getStorageItem } from '@/platform/storage';

export const getDemoMode = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  const value = await getStorageItem<string>('TRIPS_DEMO_MODE');
  return value === 'true';
};
