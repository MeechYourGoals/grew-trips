import React, { useState, useEffect } from 'react';
import { Search, MapPin, ExternalLink, AlertCircle, Loader2, Home } from 'lucide-react';
import { useBasecamp } from '@/contexts/BasecampContext';

interface WorkingGoogleMapsProps {
  className?: string;
}

export const WorkingGoogleMaps = ({ className }: WorkingGoogleMapsProps) => {
  const { basecamp, isBasecampSet } = useBasecamp();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState(() => {
    // Initialize with basecamp address if available, otherwise default
    return basecamp?.address || 'New York City';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  
  // Generate Google Maps embed URL using search (no API key needed)
  const generateEmbedUrl = (query: string, coordinates?: { lat: number; lng: number }) => {
    if (coordinates) {
      // Use coordinates for more precise location
      return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&output=embed&z=14`;
    }
    const encodedQuery = encodeURIComponent(query);
    // Use Google Maps search embed (works without API key)
    return `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
  };

  // Update current location when basecamp changes
  useEffect(() => {
    if (isBasecampSet && basecamp?.address && currentLocation !== basecamp.address) {
      setCurrentLocation(basecamp.address);
    }
  }, [basecamp, isBasecampSet]);

  // Load embed URL when location changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    const coordinates = basecamp?.coordinates && currentLocation === basecamp.address 
      ? basecamp.coordinates 
      : undefined;
    const url = generateEmbedUrl(currentLocation, coordinates);
    setEmbedUrl(url);
  }, [currentLocation, basecamp]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If we have a basecamp, search near basecamp location
      let searchLocation = searchQuery.trim();
      if (isBasecampSet && basecamp?.address) {
        searchLocation = `${searchQuery.trim()} near ${basecamp.address}`;
      }
      setCurrentLocation(searchLocation);
      setSearchQuery('');
    }
  };

  const handleQuickLocation = (location: string) => {
    setCurrentLocation(location);
  };

  const handleGoToBasecamp = () => {
    if (basecamp?.address) {
      setCurrentLocation(basecamp.address);
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

  const retryLoad = () => {
    setHasError(false);
    setIsLoading(true);
    // Force reload by updating the embed URL
    const url = generateEmbedUrl(currentLocation);
    setEmbedUrl(url + '&retry=' + Date.now());
  };

  return (
    <div className={`relative w-full h-full bg-gray-900 rounded-3xl overflow-hidden ${className}`}>
      {/* Search Field */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <form onSubmit={handleSearch} className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBasecampSet ? `Search near your basecamp...` : "Search locations on map..."}
            className="w-full bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg text-sm"
          />
        </form>
      </div>

      {/* Quick Location Buttons */}
      <div className="absolute top-20 left-4 right-4 z-20">
        <div className="flex gap-2 flex-wrap">
          {/* Basecamp button (if set) */}
          {isBasecampSet && (
            <button
              onClick={handleGoToBasecamp}
              className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1 ${
                currentLocation === basecamp?.address
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              <Home size={12} />
              Basecamp
            </button>
          )}
          
          {/* Quick location buttons */}
          {['New York City', 'Los Angeles', 'Chicago', 'Miami', 'London', 'Paris'].map((location) => (
            <button
              key={location}
              onClick={() => handleQuickLocation(location)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                currentLocation === location
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Current Location Display */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className={`backdrop-blur-sm rounded-lg px-4 py-2 flex items-center justify-between transition-all ${
          isBasecampSet && currentLocation === basecamp?.address
            ? 'bg-green-600/95 border border-green-500/50 shadow-lg shadow-green-500/25'
            : 'bg-white/95'
        }`}>
          <div className="flex items-center gap-2">
            {isBasecampSet && currentLocation === basecamp?.address ? (
              <Home size={16} className="text-white" />
            ) : (
              <MapPin size={16} className="text-blue-600" />
            )}
            <span className={`text-sm font-medium ${
              isBasecampSet && currentLocation === basecamp?.address
                ? 'text-white'
                : 'text-gray-800'
            }`}>
              {isBasecampSet && currentLocation === basecamp?.address ? (
                <>🏠 {basecamp?.name || currentLocation}</>
              ) : (
                currentLocation
              )}
            </span>
          </div>
          <a
            href={
              isBasecampSet && currentLocation === basecamp?.address
                ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(currentLocation)}`
                : `https://www.google.com/maps/search/${encodeURIComponent(currentLocation)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${
              isBasecampSet && currentLocation === basecamp?.address
                ? 'text-white hover:text-green-100'
                : 'text-blue-600 hover:text-blue-800'
            }`}
            title={
              isBasecampSet && currentLocation === basecamp?.address
                ? "Get directions from your basecamp"
                : "View on Google Maps"
            }
          >
            <ExternalLink size={16} />
          </a>
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
    </div>
  );
};