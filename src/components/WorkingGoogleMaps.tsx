import React, { useState } from 'react';
import { Search, MapPin, ExternalLink } from 'lucide-react';

interface WorkingGoogleMapsProps {
  className?: string;
}

export const WorkingGoogleMaps = ({ className }: WorkingGoogleMapsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('New York City');
  
  // Generate Google Maps embed URL directly (no API key needed for basic embeds)
  const generateEmbedUrl = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFVLmOVzZGGqhj8hj8yYZkzMnJWzwKabc&q=${encodedQuery}&zoom=14`;
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentLocation(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleQuickLocation = (location: string) => {
    setCurrentLocation(location);
  };

  const currentEmbedUrl = generateEmbedUrl(currentLocation);

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
            placeholder="Search locations on map..."
            className="w-full bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg text-sm"
          />
        </form>
      </div>

      {/* Quick Location Buttons */}
      <div className="absolute top-20 left-4 right-4 z-20">
        <div className="flex gap-2 flex-wrap">
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
        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-800">{currentLocation}</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(currentLocation)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Google Maps Iframe */}
      <iframe
        key={currentEmbedUrl}
        src={currentEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 w-full h-full"
        title="Google Maps"
      />
    </div>
  );
};