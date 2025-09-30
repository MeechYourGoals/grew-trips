/**
 * Synchronous utility to check demo mode status
 * Used for initial state and conditional imports
 */
export const getDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('TRIPS_DEMO_MODE') === 'true';
};
