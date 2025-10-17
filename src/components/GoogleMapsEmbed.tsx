
import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { GoogleMapsService } from '@/services/googleMapsService';
import { useBasecamp } from '@/contexts/BasecampContext';

interface GoogleMapsEmbedProps {
  className?: string;
}

export const GoogleMapsEmbed = ({ className }: GoogleMapsEmbedProps) => {
  const { basecamp, isBasecampSet } = useBasecamp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  
  const loadEmbedUrl = async (query: string = 'New York City') => {
    try {
      setIsLoading(true);
      setHasError(false);
      const url = await GoogleMapsService.getEmbedUrl(query);
      setEmbedUrl(url);
    } catch (error) {
      console.error('Error loading embed URL:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initMap = async () => {
      if (isBasecampSet && basecamp?.coordinates) {
        // Initialize centered on Base Camp
        const url = `https://www.google.com/maps?q=${encodeURIComponent(basecamp.address)}&center=${basecamp.coordinates.lat},${basecamp.coordinates.lng}&zoom=15&output=embed`;
        setEmbedUrl(url);
        setIsLoading(false);
      } else {
        // Default fallback
        await loadEmbedUrl('New York City');
      }
    };
    
    initMap();
  }, [isBasecampSet, basecamp]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const destination = searchQuery.trim() || 'New York City';
    
    if (isBasecampSet && basecamp?.coordinates) {
      // Context-aware search from Base Camp
      const { embedUrl: searchUrl } = GoogleMapsService.searchWithOrigin(
        destination,
        basecamp.coordinates,
        basecamp.address
      );
      setEmbedUrl(searchUrl);
      setIsLoading(false);
    } else {
      // Fallback: generic search
      await loadEmbedUrl(destination);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Search Field */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <form onSubmit={handleSearch} className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations on map..."
            className="w-full bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg text-sm"
          />
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-5 rounded-3xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-300 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-5 rounded-3xl">
          <div className="text-center p-6">
            <MapPin size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Map unavailable</h3>
            <p className="text-gray-500 text-sm mb-4">Unable to load Google Maps</p>
            <button 
              onClick={() => loadEmbedUrl(searchQuery.trim() || 'New York City')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Google Maps Iframe */}
      {embedUrl && (
        <iframe
          key={embedUrl}
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}
    </div>
  );
};
