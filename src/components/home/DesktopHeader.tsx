
import React, { useState } from 'react';
import { Crown, Plus, Settings, User, LogIn } from 'lucide-react';
import { NotificationBell } from '../NotificationBell';
import { SearchBar } from '../SearchBar';
import { AuthModal } from '../AuthModal';


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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  const handleSearchClick = () => {
    alert('Please navigate to any trip and use the Concierge for search and assistance.');
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight" aria-label="Chravel Home">
            Chravel
          </h1>
          <p className="text-muted-foreground">
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
              placeholder="Use Concierge in any trip..."
              onSearch={handleSearchClick}
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
                className="bg-gray-900/95 backdrop-blur-md border border-gray-700 text-white min-w-[200px] z-50 rounded-xl shadow-lg"
              >
                {!user && (
                  <DropdownMenuItem 
                    onClick={handleAuthClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/80 cursor-pointer"
                  >
                    <LogIn size={16} />
                    Log In / Sign Up
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={onSettings}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/80 cursor-pointer"
                >
                  <User size={16} />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onUpgrade}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/80 cursor-pointer"
                >
                  <Crown size={16} className="text-[hsl(45,95%,58%)]" />
                  Upgrade to Plus/Pro
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/80 cursor-pointer text-red-400"
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

      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
