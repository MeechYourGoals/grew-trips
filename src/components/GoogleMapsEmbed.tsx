
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface GoogleMapsEmbedProps {
  className?: string;
}

export const GoogleMapsEmbed = ({ className }: GoogleMapsEmbedProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const apiKey = 'AIzaSyAWm0vayRrQJHpMc6XcShcge52hGTt9BV4';
  
  const getEmbedUrl = () => {
    const query = searchQuery.trim() || 'Paris, France';
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}&zoom=12`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The iframe will update automatically due to the getEmbedUrl() call
  };

  return (
    <div className={`relative w-full h-full rounded-3xl overflow-hidden ${className}`}>
      {/* Search Field */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <form onSubmit={handleSearch} className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations on map..."
            className="w-full bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-lg"
          />
        </form>
      </div>

      {/* Google Maps Iframe */}
      <iframe
        key={getEmbedUrl()} // Force re-render when URL changes
        src={getEmbedUrl()}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0"
      />
    </div>
  );
};
