import React, { useState, useEffect } from 'react';
import { Search, MapPin, ExternalLink, AlertCircle, Loader2, Home, Edit2, Lock } from 'lucide-react';
import { useBasecamp } from '@/contexts/BasecampContext';
import { GoogleMapsService } from '@/services/googleMapsService';
import { BasecampSelector } from './BasecampSelector';
import { useToast } from '@/hooks/use-toast';

interface WorkingGoogleMapsProps {
  className?: string;
}

export const WorkingGoogleMaps = ({ className }: WorkingGoogleMapsProps) => {
  const { basecamp, isBasecampSet } = useBasecamp();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState(() => {
    // Initialize with basecamp address if available, otherwise default
    return basecamp?.address || 'New York City';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  const [isBasecampSelectorOpen, setIsBasecampSelectorOpen] = useState(false);
  const [isShowingDirections, setIsShowingDirections] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [directionsUrl, setDirectionsUrl] = useState('');
  
  // Generate Google Maps embed URL using search (no API key needed)
  const generateEmbedUrl = (query: string, coordinates?: { lat: number; lng: number }, isDirections: boolean = false) => {
    // If Base Camp is set, ALWAYS use it as context
    if (isBasecampSet && basecamp?.coordinates) {
      if (isDirections) {
        // Directions from Base Camp to destination
        return GoogleMapsService.generateDirectionsEmbedUrlWithCoords(
          basecamp.coordinates,
          query
        );
      } else {
        // Place search biased near Base Camp
        return GoogleMapsService.searchPlacesWithLocationBias(query, basecamp.coordinates);
      }
    }
    
    // Fallback: generic search (no Base Camp set)
    if (coordinates) {
      return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&output=embed&z=14`;
    }
    
    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
  };

  // Initialize map centered on Base Camp when set
  useEffect(() => {
    if (isBasecampSet && basecamp?.address && basecamp?.coordinates) {
      // Center map on Base Camp with optimal zoom
      const initUrl = `https://www.google.com/maps?q=${encodeURIComponent(basecamp.address)}&center=${basecamp.coordinates.lat},${basecamp.coordinates.lng}&zoom=15&output=embed`;
      setEmbedUrl(initUrl);
      setCurrentLocation(basecamp.address);
      setIsShowingDirections(false);
      
      console.log('🏠 Base Camp initialized:', {
        address: basecamp.address,
        coords: basecamp.coordinates
      });
    } else {
      // No Base Camp: show generic map
      const defaultUrl = `https://www.google.com/maps?q=New+York+City&output=embed`;
      setEmbedUrl(defaultUrl);
    }
  }, [basecamp, isBasecampSet]);

  // Load embed URL when location changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    const coordinates = basecamp?.coordinates && currentLocation === basecamp.address 
      ? basecamp.coordinates 
      : undefined;
    const url = generateEmbedUrl(currentLocation, coordinates, isShowingDirections);
    setEmbedUrl(url);
  }, [currentLocation, basecamp, isShowingDirections]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !isBasecampSet || !basecamp?.coordinates) {
      toast({
        title: "Base Camp Required",
        description: "Please set your base camp first to search nearby places.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    const destination = searchQuery.trim();
    
    try {
      // Generate context-aware search with Base Camp as origin
      const { embedUrl: newEmbedUrl, directionsUrl: newDirectionsUrl } = GoogleMapsService.searchWithOrigin(
        destination,
        basecamp.coordinates,
        basecamp.address
      );
      
      setEmbedUrl(newEmbedUrl);
      setCurrentLocation(destination);
      setIsShowingDirections(true);
      setSearchQuery('');
      
      // Store directions URL for external link
      setDirectionsUrl(newDirectionsUrl);
      
      console.log('🎯 Search from Base Camp:', {
        origin: basecamp.address,
        destination,
        coords: basecamp.coordinates
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickLocation = (location: string) => {
    setCurrentLocation(location);
  };

  const handleGoToBasecamp = () => {
    if (basecamp?.address) {
      setCurrentLocation(basecamp.address);
      setIsShowingDirections(false);
    }
  };

  const handleEditBasecamp = () => {
    setIsBasecampSelectorOpen(true);
  };

  const handleBasecampSet = (newBasecamp: any) => {
    setIsBasecampSelectorOpen(false);
    // The basecamp context will handle the update
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const retryLoad = () => {
    setHasError(false);
    setIsLoading(true);
    // Force reload by updating the embed URL
    const url = generateEmbedUrl(currentLocation);
    setEmbedUrl(url + '&retry=' + Date.now());
  };

  return (
    <div className={`relative w-full h-full bg-gray-900 rounded-3xl overflow-hidden ${className}`}>
      {/* Origin + Destination Search */}
      <div className="absolute top-4 left-4 right-4 z-20">
        {/* Origin Field (Auto-populated from Base Camp) */}
        {isBasecampSet && (
          <div className="bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl p-3 mb-2 shadow-lg">
            <div className="flex items-center gap-2">
              <Home size={16} className="text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-xs text-gray-500 font-medium">Starting from</label>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-800 font-medium truncate">
                    {basecamp?.name || basecamp?.address}
                  </span>
                  <Lock size={12} className="text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Destination Search (User input) */}
        <form onSubmit={handleSearch} className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBasecampSet ? "Where do you want to go?" : "Set basecamp first to search"}
            className="w-full bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!isBasecampSet || isSearching}
          />
          {isSearching && (
            <Loader2 size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 animate-spin" />
          )}
        </form>
      </div>

      {/* Origin Lock Indicator */}
      {isBasecampSet && isShowingDirections && (
        <div className="absolute top-20 left-4 bg-green-600/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-lg z-20">
          <Lock size={12} className="text-white" />
          <span className="text-xs text-white font-medium">Origin locked</span>
        </div>
      )}

      {/* Current Location Display */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className={`backdrop-blur-sm rounded-lg px-4 py-2 flex items-center justify-between transition-all ${
          isBasecampSet && currentLocation === basecamp?.address && !isShowingDirections
            ? 'bg-green-600/95 border border-green-500/50 shadow-lg shadow-green-500/25'
            : isShowingDirections && isBasecampSet
            ? 'bg-blue-600/95 border border-blue-500/50 shadow-lg shadow-blue-500/25'
            : 'bg-white/95'
        }`}>
          <div className="flex items-center gap-2">
            {isBasecampSet && currentLocation === basecamp?.address && !isShowingDirections ? (
              <Home size={16} className="text-white" />
            ) : isShowingDirections && isBasecampSet ? (
              <MapPin size={16} className="text-white" />
            ) : (
              <MapPin size={16} className="text-blue-600" />
            )}
            <span className={`text-sm font-medium ${
              (isBasecampSet && currentLocation === basecamp?.address && !isShowingDirections) || (isShowingDirections && isBasecampSet)
                ? 'text-white'
                : 'text-gray-800'
            }`}>
              {isShowingDirections && isBasecampSet ? (
                <>📍 Directions to {currentLocation}</>
              ) : isBasecampSet && currentLocation === basecamp?.address ? (
                <>🏠 {basecamp?.name || basecamp?.address}</>
              ) : (
                currentLocation
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Edit Basecamp Button (only show when at basecamp or when basecamp is set) */}
            {isBasecampSet && (
              <button
                onClick={handleEditBasecamp}
                className={`transition-colors ${
                  (isBasecampSet && currentLocation === basecamp?.address && !isShowingDirections) || (isShowingDirections && isBasecampSet)
                    ? 'text-white hover:text-green-100'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
                title="Edit basecamp"
              >
                <Edit2 size={14} />
              </button>
            )}
            <a
              href={
                isShowingDirections && isBasecampSet
                  ? `https://www.google.com/maps/dir/${encodeURIComponent(basecamp?.address || '')},${encodeURIComponent(currentLocation)}`
                  : isBasecampSet && currentLocation === basecamp?.address
                  ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(currentLocation)}`
                  : `https://www.google.com/maps/search/${encodeURIComponent(currentLocation)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${
                (isBasecampSet && currentLocation === basecamp?.address && !isShowingDirections) || (isShowingDirections && isBasecampSet)
                  ? 'text-white hover:text-green-100'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
              title={
                isShowingDirections && isBasecampSet
                  ? "Open directions in Google Maps"
                  : isBasecampSet && currentLocation === basecamp?.address
                  ? "Get directions from your basecamp"
                  : "View on Google Maps"
              }
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
          <div className="text-center text-white max-w-sm mx-auto p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
            <p className="text-sm text-gray-300 mb-4">
              Unable to load the map for "{currentLocation}". You can still view this location on Google Maps.
            </p>
            <div className="space-y-2">
              <button
                onClick={retryLoad}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
              <a
                href={
                  isBasecampSet && currentLocation === basecamp?.address
                    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(currentLocation)}`
                    : `https://www.google.com/maps/search/${encodeURIComponent(currentLocation)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors inline-block text-center"
              >
                {isBasecampSet && currentLocation === basecamp?.address
                  ? 'Get Directions from Basecamp'
                  : 'Open in Google Maps'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Google Maps Iframe */}
      {embedUrl && !hasError && (
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
          title="Google Maps"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}

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