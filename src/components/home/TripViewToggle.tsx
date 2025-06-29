
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { MapPin, Crown } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

interface TripViewToggleProps {
  viewMode: string;
  onViewModeChange: (value: string) => void;
}

export const TripViewToggle = ({ viewMode, onViewModeChange }: TripViewToggleProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-center mb-8">
      <ToggleGroup 
        type="single" 
        value={viewMode} 
        onValueChange={(value) => value && onViewModeChange(value)}
        className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-2"
      >
        <ToggleGroupItem 
          value="myTrips" 
          className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl text-white data-[state=on]:bg-yellow-500 data-[state=on]:text-black transition-all font-medium ${isMobile ? 'text-sm' : ''}`}
        >
          <div className="flex items-center gap-2">
            <MapPin size={isMobile ? 16 : 18} />
            <span className={isMobile ? 'text-sm' : ''}>My Trips</span>
          </div>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="tripsPro" 
          className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl text-white data-[state=on]:bg-gradient-to-r data-[state=on]:from-yellow-500 data-[state=on]:to-yellow-600 data-[state=on]:text-black transition-all font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}
        >
          <Crown size={isMobile ? 16 : 18} />
          <span className={isMobile ? 'text-sm' : ''}>Trips Pro</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
