
import React from 'react';

interface GoogleMapsEmbedProps {
  className?: string;
}

export const GoogleMapsEmbed = ({ className }: GoogleMapsEmbedProps) => {
  // Using your Google Maps API key
  const apiKey = 'AIzaSyAWm0vayRrQJHpMc6XcShcge52hGTt9BV4';
  
  // Default location - you can make this dynamic later
  const defaultLocation = 'Paris, France';
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(defaultLocation)}&zoom=12`;

  return (
    <div className={`relative w-full h-full rounded-3xl overflow-hidden ${className}`}>
      <iframe
        src={embedUrl}
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
