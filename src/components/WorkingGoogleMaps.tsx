import React, { useState, useEffect } from 'react';
import { MapPin, Edit2 } from 'lucide-react';
import { GoogleMapsService } from '@/services/googleMapsService';
import { useBasecamp } from '@/contexts/BasecampContext';
import { BasecampSelector } from './BasecampSelector';

interface WorkingGoogleMapsProps {
  className?: string;
}

export const WorkingGoogleMaps = ({ className = '' }: WorkingGoogleMapsProps) => {
  const { basecamp, isBasecampSet } = useBasecamp();
  const [embedUrl, setEmbedUrl] = useState('');
  const [isBasecampSelectorOpen, setIsBasecampSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate embed URL based on Base Camp
  useEffect(() => {
    const loadMap = async () => {
      setIsLoading(true);
      
      try {
        if (isBasecampSet && basecamp?.address && basecamp?.coordinates) {
          // Try to get embed with origin pre-filled
          try {
            const url = await GoogleMapsService.getEmbedUrlWithOrigin(basecamp.address);
            setEmbedUrl(url);
          } catch (error) {
            // Fallback to native place URL
            const url = GoogleMapsService.generateNativeEmbedUrl(
              basecamp.address,
              basecamp.coordinates
            );
            setEmbedUrl(url);
          }
        } else {
          // No Base Camp: Show approximate location
          const url = GoogleMapsService.generateNativeEmbedUrl();
          setEmbedUrl(url);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMap();
  }, [basecamp, isBasecampSet]);

  const handleEditBasecamp = () => {
    setIsBasecampSelectorOpen(true);
  };

  const handleBasecampSet = () => {
    setIsBasecampSelectorOpen(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative w-full h-full bg-background ${className}`}>
      {/* Floating Base Camp Button */}
      <button
        onClick={handleEditBasecamp}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-lg hover:bg-accent transition-colors text-sm font-medium"
      >
        {isBasecampSet ? (
          <>
            <MapPin size={16} className="text-primary" />
            <span className="text-foreground">{basecamp?.name || 'Base Camp'}</span>
            <Edit2 size={14} className="text-muted-foreground" />
          </>
        ) : (
          <>
            <MapPin size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Set Base Camp</span>
          </>
        )}
      </button>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-6 shadow-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-foreground font-medium">Loading map...</p>
            </div>
          </div>
        </div>
      )}

      {/* Google Maps Iframe - Native UI */}
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={handleIframeLoad}
        title="Google Maps"
        allow="geolocation"
      />

      {/* Basecamp Selector Modal */}
      <BasecampSelector
        isOpen={isBasecampSelectorOpen}
        onClose={() => setIsBasecampSelectorOpen(false)}
        onBasecampSet={handleBasecampSet}
        currentBasecamp={basecamp}
      />
    </div>
  );
};
