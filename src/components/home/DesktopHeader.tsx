
import React from 'react';
import { Crown, Plus, Settings, User } from 'lucide-react';
import { NotificationBell } from '../NotificationBell';
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
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
          {viewMode === 'myTrips' ? 'My Trips' : 'Trips Pro'}
        </h1>
        <p className="text-gray-400">
          {viewMode === 'myTrips' 
            ? 'Plan, organize, and share your perfect trips' 
            : 'Professional trip management with advanced features'
          }
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={onUpgrade}
          className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg font-medium"
        >
          <Crown size={20} />
          Upgrade to Plus/Pro
        </button>
        
        <button
          onClick={onCreateTrip}
          className="bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:bg-gray-800/80 hover:border-gray-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        >
          <Plus size={20} />
          Create New Trip
        </button>

        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-gray-900/80 backdrop-blur-md border border-gray-700 hover:bg-gray-800/80 hover:border-gray-600 text-white p-3 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Settings size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-gray-900/95 backdrop-blur-md border border-gray-700 text-white min-w-[200px] z-50"
          >
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
              <Crown size={16} className="text-yellow-500" />
              Upgrade to Plus/Pro
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
