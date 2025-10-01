import { useDemoModeStore } from '@/store/demoModeStore';

export const useDemoMode = () => {
  const { isDemoMode, isLoading, enable, disable, toggle } = useDemoModeStore();

  return {
    isDemoMode,
    isLoading,
    enableDemoMode: enable,
    disableDemoMode: disable,
    toggleDemoMode: toggle
  };
};