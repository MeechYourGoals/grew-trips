
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { MapPin, Crown, Calendar, Compass, Zap } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

interface TripViewToggleProps {
  viewMode: string;
  onViewModeChange: (value: string) => void;
  onUpgrade?: () => void;
}

export const TripViewToggle = ({ viewMode, onViewModeChange, onUpgrade }: TripViewToggleProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      <ToggleGroup 
        type="single" 
        value={viewMode} 
        onValueChange={(value) => value && onViewModeChange(value)}
        className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-2 w-full flex justify-center"
      >
        <ToggleGroupItem 
          value="myTrips" 
          className={`px-3 sm:px-6 py-3 sm:py-4 rounded-xl text-white data-[state=on]:bg-[hsl(45,95%,58%)] data-[state=on]:text-black transition-all font-medium ${isMobile ? 'text-sm' : ''}`}
        >
          <div className="flex items-center gap-2">
            <MapPin size={isMobile ? 16 : 18} />
            <span className={isMobile ? 'text-sm' : ''}>My Trips</span>
          </div>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="tripsPro" 
          className={`px-3 sm:px-6 py-3 sm:py-4 rounded-xl text-white data-[state=on]:bg-gradient-to-r data-[state=on]:from-[hsl(210,8%,45%)] data-[state=on]:to-[hsl(210,10%,55%)] data-[state=on]:text-white transition-all font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}
        >
          <Crown size={isMobile ? 16 : 18} />
          <span className={isMobile ? 'text-sm' : ''}>Chravel Pro</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="events" 
          className={`px-3 sm:px-6 py-3 sm:py-4 rounded-xl text-white data-[state=on]:bg-[hsl(217,91%,25%)] data-[state=on]:text-white transition-all font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}
        >
          <Calendar size={isMobile ? 16 : 18} />
          <span className={isMobile ? 'text-sm' : ''}>Events</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="travelRecs" 
          className={`px-3 sm:px-6 py-3 sm:py-4 rounded-xl text-white data-[state=on]:bg-gradient-to-r data-[state=on]:from-glass-accent-orange data-[state=on]:to-glass-accent-orange-light data-[state=on]:text-white transition-all font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}
        >
          <Compass size={isMobile ? 16 : 18} />
          <span className={isMobile ? 'text-sm' : ''}>Chravel Recs</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="upgrade" 
          className={`px-3 sm:px-6 py-3 sm:py-4 rounded-xl text-black bg-gradient-to-r from-[hsl(45,95%,58%)] to-[hsl(45,90%,65%)] hover:from-[hsl(45,90%,55%)] hover:to-[hsl(45,85%,62%)] transition-all font-medium flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}
        >
          <Zap size={isMobile ? 16 : 18} />
          <span className={isMobile ? 'text-sm' : ''}>Upgrade Plan</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
