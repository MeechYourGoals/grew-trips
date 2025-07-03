
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface GoogleMapsEmbedProps {
  className?: string;
}

export const GoogleMapsEmbed = ({ className }: GoogleMapsEmbedProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  if (!apiKey) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}> 
        <p className="text-gray-500 text-sm">Google Maps API key is not configured.</p>
      </div>
    );
  }
  
  const getEmbedUrl = () => {
    const query = searchQuery.trim() || 'New York City';
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}&zoom=12`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasError(false);
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
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Google Maps Iframe */}
      <iframe
        key={getEmbedUrl()}
        src={getEmbedUrl()}
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
    </div>
  );
};
