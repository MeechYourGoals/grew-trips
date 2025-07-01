
import React, { useState } from 'react';
import { Plus, Crown, Settings, Menu, X } from 'lucide-react';
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

  if (!isMobile) return null;

  return (
    <>
      <div className="flex items-center justify-between mb-6 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {viewMode === 'myTrips' ? 'My Trips' : 'Trips Pro'}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateTrip}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black p-3 rounded-xl transition-all duration-300 shadow-lg min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
          
          <button
            onClick={() => setIsMenuOpen(true)}
            className="bg-gray-800/80 backdrop-blur-md border border-gray-700 hover:bg-gray-700/80 text-white p-3 rounded-xl transition-all duration-300 min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-700 rounded-t-3xl p-6 animate-slide-in-bottom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                className="w-full flex items-center gap-4 bg-gray-800/50 hover:bg-gray-700/50 text-white p-5 rounded-xl transition-all min-h-[64px]"
              >
                <Crown size={24} className="text-yellow-500 flex-shrink-0" />
                <span className="font-medium text-lg">Pro Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  onUpgradeToProo();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-4 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/30 text-yellow-400 p-5 rounded-xl transition-all min-h-[64px]"
              >
                <Crown size={24} className="flex-shrink-0" />
                <span className="font-medium text-lg">Upgrade to Pro</span>
              </button>
              
              <button
                onClick={() => {
                  onSettings();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-4 bg-gray-800/50 hover:bg-gray-700/50 text-white p-5 rounded-xl transition-all min-h-[64px]"
              >
                <Settings size={24} className="flex-shrink-0" />
                <span className="font-medium text-lg">Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
