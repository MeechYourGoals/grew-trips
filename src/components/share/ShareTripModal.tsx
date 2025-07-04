import React, { useEffect, useState } from 'react';
import { X, Download, Share2, Loader2, Palette } from 'lucide-react';
import { Button } from '../ui/button';
import { TripPosterGenerator, ColorTheme } from './TripPosterGenerator';
import { useTripPoster } from '../../hooks/useTripPoster';
import { toast } from 'sonner';

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
  
  // Color themes
  const colorThemes: ColorTheme[] = [
    {
      name: 'gold',
      background: 'linear-gradient(135deg, hsl(45 93% 58%) 0%, hsl(43 89% 38%) 50%, hsl(41 85% 28%) 100%)',
      overlay: 'bg-gradient-to-b from-black/20 via-black/30 to-black/40'
    },
    {
      name: 'teal',
      background: 'linear-gradient(135deg, hsl(173 80% 40%) 0%, hsl(170 77% 25%) 50%, hsl(168 74% 15%) 100%)',
      overlay: 'bg-gradient-to-b from-black/20 via-black/30 to-black/40'
    },
    {
      name: 'blush',
      background: 'linear-gradient(135deg, hsl(340 85% 65%) 0%, hsl(335 82% 45%) 50%, hsl(330 79% 30%) 100%)',
      overlay: 'bg-gradient-to-b from-black/20 via-black/30 to-black/40'
    },
    {
      name: 'midnight',
      background: 'linear-gradient(135deg, hsl(220 70% 35%) 0%, hsl(215 67% 20%) 50%, hsl(210 64% 10%) 100%)',
      overlay: 'bg-gradient-to-b from-black/20 via-black/30 to-black/40'
    }
  ];

  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(colorThemes[0]);

  useEffect(() => {
    if (isOpen) {
      // Randomize theme on modal open
      const randomTheme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
      setSelectedTheme(randomTheme);
      
      // Generate poster when modal opens
      setTimeout(() => {
        generatePoster();
      }, 100); // Small delay to ensure DOM is ready
    } else {
      // Reset when modal closes
      resetPoster();
    }
  }, [isOpen]);

  const cycleTheme = () => {
    const currentIndex = colorThemes.findIndex(theme => theme.name === selectedTheme.name);
    const nextIndex = (currentIndex + 1) % colorThemes.length;
    setSelectedTheme(colorThemes[nextIndex]);
    
    // Regenerate poster with new theme
    setTimeout(() => {
      generatePoster();
    }, 100);
  };

  const handleDownload = () => {
    downloadPoster(trip.title);
    toast.success("Poster downloaded successfully!");
  };

  const handleShare = async () => {
    await sharePoster(trip.title);
    toast.success("Poster ready to share!");
  };

  if (!isOpen) return null;

  const handleClose = () => {
    resetPoster();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background/95 backdrop-blur-md border border-border rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Share Trip</h2>
            <p className="text-muted-foreground">Generate a poster to share with friends</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={cycleTheme}
              variant="ghost"
              size="icon"
              title="Change color theme"
              className="hover:bg-accent"
            >
              <Palette size={20} />
            </Button>
            <Button onClick={handleClose} variant="ghost" size="icon" title="Close">
              <X size={24} />
            </Button>
          </div>
        </div>

        {/* Poster Preview */}
        <div className="flex flex-col items-center mb-6">
          {/* Hidden poster generator for canvas capture */}
          <div className="absolute -left-[9999px] -top-[9999px]">
            <TripPosterGenerator trip={trip} colorTheme={selectedTheme} />
          </div>
          
          {/* Visible scaled preview */}
          <div className="transform scale-75 origin-center mb-4">
            <TripPosterGenerator trip={trip} colorTheme={selectedTheme} />
          </div>
          
          {/* Theme indicator */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Theme:</span>
            <span className="text-sm font-medium capitalize text-foreground">{selectedTheme.name}</span>
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
            onClick={handleDownload}
            disabled={isGenerating || !posterUrl}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
          >
            <Download size={20} className="mr-2" />
            Download
          </Button>
          
          <Button
            onClick={handleShare}
            disabled={isGenerating || !posterUrl}
            variant="outline"
            className="flex-1"
          >
            <Share2 size={20} className="mr-2" />
            Share Poster
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Poster will be saved as 1080x1350px image (Instagram optimized)
        </p>
      </div>
    </div>
  );
};