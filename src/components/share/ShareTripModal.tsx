import React, { useEffect } from 'react';
import { X, Download, Share2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { TripPosterGenerator } from './TripPosterGenerator';
import { useTripPoster } from '../../hooks/useTripPoster';

interface Participant {
  id: number;
  name: string;
  avatar: string;
}

interface Trip {
  id: number;
  title: string;
  location: string;
  dateRange: string;
  participants: Participant[];
}

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

export const ShareTripModal = ({ isOpen, onClose, trip }: ShareTripModalProps) => {
  const { isGenerating, posterUrl, error, generatePoster, downloadPoster, sharePoster, resetPoster } = useTripPoster();

  useEffect(() => {
    if (isOpen) {
      // Generate poster when modal opens
      setTimeout(() => {
        generatePoster();
      }, 100); // Small delay to ensure DOM is ready
    } else {
      // Reset when modal closes
      resetPoster();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    resetPoster();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background/95 backdrop-blur-md border border-border rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Share Trip</h2>
            <p className="text-muted-foreground">Generate a poster to share with friends</p>
          </div>
          <Button onClick={handleClose} variant="ghost" size="icon">
            <X size={24} />
          </Button>
        </div>

        {/* Poster Preview */}
        <div className="flex flex-col items-center mb-6">
          {/* Hidden poster generator for canvas capture */}
          <div className="absolute -left-[9999px] -top-[9999px]">
            <TripPosterGenerator trip={trip} />
          </div>
          
          {/* Visible scaled preview */}
          <div className="transform scale-75 origin-center mb-4">
            <TripPosterGenerator trip={trip} />
          </div>

          {/* Status */}
          {isGenerating && (
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Loader2 size={20} className="animate-spin" />
              <span>Generating poster...</span>
            </div>
          )}

          {error && (
            <div className="text-destructive text-sm mb-4 text-center">
              <p>Failed to generate poster: {error}</p>
              <Button 
                onClick={generatePoster} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => downloadPoster(trip.title)}
            disabled={isGenerating || !posterUrl}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
          >
            <Download size={20} className="mr-2" />
            Download
          </Button>
          
          <Button
            onClick={() => sharePoster(trip.title)}
            disabled={isGenerating || !posterUrl}
            variant="outline"
            className="flex-1"
          >
            <Share2 size={20} className="mr-2" />
            Share
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Poster will be saved as 1080x1350px image (Instagram optimized)
        </p>
      </div>
    </div>
  );
};