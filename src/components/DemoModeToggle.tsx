import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Button } from './ui/button';

export const DemoModeToggle = () => {
  const { isDemoMode, toggleDemoMode, isLoading } = useDemoMode();

  if (isLoading) return null;

  return (
    <Button
      onClick={toggleDemoMode}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${
        isDemoMode 
          ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30' 
          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700/50'
      }`}
    >
      {isDemoMode ? <Eye size={16} /> : <EyeOff size={16} />}
      <span className="text-xs">
        {isDemoMode ? 'Demo ON' : 'Demo OFF'}
      </span>
    </Button>
  );
};