import React, { useState } from 'react';
import { Crown, Plus, Settings, User, LogIn, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from '../NotificationBell';
import { SearchBar } from '../SearchBar';
import { AuthModal } from '../AuthModal';
import { DemoModeToggle } from '../DemoModeToggle';


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
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  const blurbs: Record<string, string> = {
    myTrips: 'Plan your perfect trip.',
    tripsPro: 'Enterprise software for professional trip management.',
    events: 'Professional event management and coordination.',
    travelRecs: 'Discover curated hotels, dining, and experiences.',
  };
  const subtitle = blurbs[viewMode] ?? 'Plan your perfect trip.';

  const handleSearchClick = () => {
    alert('Please navigate to any trip and use the Concierge for search and assistance.');
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      {/* Demo Mode Toggle - Aligned to match Upgrade Plan width */}
      <div className="flex justify-end mb-3">
        <div className="w-[150px]">
          <DemoModeToggle />
        </div>
      </div>

      {/* Main Header Container - 600px to match toggle group */}
      <div className="mb-6">
        {/* Grid Layout: Brand (280px) | Search (280px) | Actions (auto) */}
        <div className="grid grid-cols-[280px_280px_auto] gap-4 items-center mb-5">
          {/* Column 1: Brand - spans width of My Trips + Travel Pro buttons */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold text-foreground tracking-tight" aria-label="Chravel Home">
              Chravel
            </h1>
            <div className="mt-1">
              <p className="text-sm text-muted-foreground font-medium">The Group Chat for Group Travel</p>
            </div>
          </div>

          {/* Column 2: Search Bar - spans width of Events + Travel Recs buttons */}
          <div className="flex items-center">
            <SearchBar
              placeholder="Search for and plan your perfect trip."
              onSearch={handleSearchClick}
              className="cursor-pointer w-full"
            />
          </div>

          {/* Column 3: Action Buttons - aligned to right */}
          <div className="flex items-center gap-3 justify-end">
            {/* Schedule Demo buttons for Pro/Events views */}
            {viewMode === 'tripsPro' && (
              <button
                onClick={() => window.location.href = 'mailto:christian@chravelapp.com?subject=Requesting%20a%20Chravel%20Demo'}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 h-12 rounded-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg font-medium text-sm"
              >
                <Crown size={18} />
                Schedule Demo
              </button>
            )}
            {viewMode === 'events' && (
              <button
                onClick={() => window.location.href = 'mailto:christian@chravelapp.com?subject=Requesting%20a%20Chravel%20Demo'}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 h-12 rounded-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg font-medium text-sm"
              >
                <Crown size={18} />
                Schedule Demo
              </button>
            )}
            
            {/* Action button group - compact and aligned */}
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
                  Upgrade Chravel Experience
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem 
                    onClick={() => navigate('/organizations')}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/80 cursor-pointer"
                  >
                    <Building size={16} />
                    My Organizations
                  </DropdownMenuItem>
                )}
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