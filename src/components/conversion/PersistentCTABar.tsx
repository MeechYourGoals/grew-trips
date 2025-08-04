import React from 'react';
import { Calendar, Phone, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';

interface PersistentCTABarProps {
  viewMode?: string;
  onPlanTrip?: () => void;
  onScheduleDemo?: () => void;
  onSeePricing?: () => void;
}

export const PersistentCTABar = ({ 
  viewMode = 'consumer', 
  onPlanTrip, 
  onScheduleDemo, 
  onSeePricing 
}: PersistentCTABarProps) => {
  const { user } = useAuth();

  const getCTAButton = () => {
    switch (viewMode) {
      case 'tripsPro':
        return (
          <Button 
            onClick={() => window.location.href = 'mailto:christian@chravelapp.com?subject=Requesting%20a%20Chravel%20Demo'}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 shadow-lg"
          >
            <Phone size={16} />
            Schedule a Demo
          </Button>
        );
      case 'events':
        return (
          <Button 
            onClick={onSeePricing}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground flex items-center gap-2 shadow-lg"
          >
            <DollarSign size={16} />
            See Pricing
          </Button>
        );
      default:
        return (
          <Button 
            onClick={onPlanTrip}
            className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 shadow-lg"
          >
            <Calendar size={16} />
            Plan Your Trip
          </Button>
        );
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-background/95 backdrop-blur-md border border-border rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground font-medium">
            Ready to get started?
          </div>
          {getCTAButton()}
        </div>
      </div>
    </div>
  );
};