import { useState, useEffect } from 'react';
import { demoModeService } from '@/services/demoModeService';

export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDemoMode = async () => {
      const enabled = await demoModeService.isDemoModeEnabled();
      setIsDemoMode(enabled);
      setIsLoading(false);
    };

    checkDemoMode();

    // Listen for storage changes (in case demo mode is toggled in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'TRIPS_DEMO_MODE') {
        checkDemoMode();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const enableDemoMode = async () => {
    await demoModeService.enableDemoMode();
    setIsDemoMode(true);
  };

  const disableDemoMode = async () => {
    await demoModeService.disableDemoMode();
    setIsDemoMode(false);
  };

  const toggleDemoMode = () => {
    if (isDemoMode) {
      disableDemoMode();
    } else {
      enableDemoMode();
    }
  };

  return {
    isDemoMode,
    isLoading,
    enableDemoMode,
    disableDemoMode,
    toggleDemoMode
  };
};