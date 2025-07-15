
import React, { useState } from 'react';
import { Crown, Plus, Settings, User, LogIn, Sun, Moon } from 'lucide-react';
import { Switch } from '../ui/switch';
import { NotificationBell } from '../NotificationBell';
import { SearchBar } from '../SearchBar';
import { GlobalSearchModal } from '../GlobalSearchModal';
import { AuthModal } from '../AuthModal';

import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { useAuth } from '../../hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface DesktopHeaderProps {
  viewMode: string;
  onCreateTrip: () => void;
  onUpgrade: () => void;
  onSettings: () => void;
}

export const DesktopHeader = ({ viewMode, onCreateTrip, onUpgrade, onSettings }: DesktopHeaderProps) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { search } = useGlobalSearch();
  const { user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
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

  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      search(query);
      setShowSearchModal(true);
    }
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <img 
            src="/lovable-uploads/2c4cc09a-de6f-437c-88e8-8a37ff8bb566.png" 
            alt="Junto" 
            className="h-24 w-auto mb-2"
          />
          <p className="text-gray-400">
            {viewMode === 'myTrips' 
              ? 'Plan, organize, and share your perfect trips' 
              : viewMode === 'tripsPro'
              ? 'Professional trip management with advanced features'
              : 'Professional event management and coordination'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <div className="w-80">
            <SearchBar
              placeholder="Search trips, people, files..."
              onSearch={handleSearch}
              className="cursor-pointer"
            />
          </div>

          <button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-[hsl(45,95%,58%)] to-[hsl(45,90%,65%)] hover:from-[hsl(45,90%,55%)] hover:to-[hsl(45,85%,62%)] text-black px-4 py-2 h-12 rounded-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg font-medium text-sm"
          >
            <Crown size={18} />
            Upgrade to Plus/Pro
          </button>
          
          {/* Consistent sized buttons container */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCreateTrip}
              className="w-12 h-12 bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:bg-gray-800/80 hover:border-gray-600 text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              title="New Trip"
            >
              <Plus size={20} />
            </button>

            <div className="w-12 h-12">
              <NotificationBell />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-12 h-12 bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:bg-gray-800/80 hover:border-gray-600 text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  <Settings size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                sideOffset={8}
                className="bg-popover backdrop-blur-md border border-border text-popover-foreground min-w-[200px] z-50 rounded-xl shadow-lg"
              >
                {!user && (
                  <DropdownMenuItem 
                    onClick={handleAuthClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <LogIn size={16} />
                    Log In / Sign Up
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={onSettings}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <User size={16} />
                  Account Settings
                </DropdownMenuItem>
                <div className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent rounded-sm">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon size={16} className="text-blue-400" /> : <Sun size={16} className="text-yellow-500" />}
                    <span className="text-sm">
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <DropdownMenuItem 
                  onClick={onUpgrade}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <Crown size={16} className="text-primary" />
                  Upgrade to Plus/Pro
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer text-destructive"
                  >
                    <LogIn size={16} />
                    Sign Out
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <GlobalSearchModal 
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
