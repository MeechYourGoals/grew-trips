import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Hotel, UtensilsCrossed, MapPin, Camera, Star } from 'lucide-react';

interface RecommendationFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: 'all', label: 'All', icon: Star },
  { id: 'hotel', label: 'Hotels', icon: Hotel },
  { id: 'restaurant', label: 'Dining', icon: UtensilsCrossed },
  { id: 'activity', label: 'Activities', icon: MapPin },
  { id: 'tour', label: 'Tours', icon: Camera },
  { id: 'experience', label: 'Experiences', icon: Star },
];

export const RecommendationFilters = ({ activeFilter, onFilterChange }: RecommendationFiltersProps) => {
  return (
    <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        
        return (
          <Button
            key={filter.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-2 whitespace-nowrap ${
              isActive 
                ? 'bg-accent text-accent-foreground border-accent' 
                : 'border-border/50 hover:border-accent/50'
            }`}
            onClick={() => onFilterChange(filter.id)}
          >
            <Icon className="w-4 h-4" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
};