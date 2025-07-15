
import React, { useState } from 'react';
import { Plus, Crown, Settings, Menu, X, Sun, Moon } from 'lucide-react';
import { Switch } from './ui/switch';
import { useIsMobile } from '../hooks/use-mobile';

interface MobileHeaderProps {
  onCreateTrip: () => void;
  onUpgradeToProo: () => void;
  onSettings: () => void;
  onProDashboard: () => void;
  viewMode: string;
}

export const MobileHeader = ({ 
  onCreateTrip, 
  onUpgradeToProo, 
  onSettings, 
  onProDashboard, 
  viewMode 
}: MobileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!isMobile) return null;

  return (
    <>
      <div className="flex items-center justify-between mb-6 bg-card backdrop-blur-md border border-border rounded-2xl p-4">
        <div>
          <img 
            src="/lovable-uploads/2c4cc09a-de6f-437c-88e8-8a37ff8bb566.png" 
            alt="Junto" 
            className="h-16 w-auto"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateTrip}
            className="bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground p-3 rounded-xl transition-all duration-300 shadow-lg"
            title="New Trip"
          >
            <Plus size={20} />
          </button>
          
          <button
            onClick={() => setIsMenuOpen(true)}
            className="bg-secondary backdrop-blur-md border border-border hover:bg-secondary/80 text-secondary-foreground p-3 rounded-xl transition-all duration-300"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-popover backdrop-blur-md border-t border-border rounded-t-3xl p-6 animate-slide-in-bottom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-popover-foreground">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground p-2"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  onProDashboard();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground p-4 rounded-xl transition-all"
              >
                <Crown size={20} className="text-primary" />
                <span className="font-medium">Pro Dashboard</span>
              </button>
              
              {/* Theme Toggle */}
              <div className="w-full flex items-center justify-between gap-3 bg-secondary/50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-yellow-500" />}
                  <span className="font-medium text-foreground">
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              
              <button
                onClick={() => {
                  onUpgradeToProo();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 bg-gradient-to-r from-primary/20 to-primary/20 border border-primary/30 text-primary p-4 rounded-xl transition-all"
              >
                <Crown size={20} />
                <span className="font-medium">Upgrade to Pro</span>
              </button>
              
              <button
                onClick={() => {
                  onSettings();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground p-4 rounded-xl transition-all"
              >
                <Settings size={20} />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
