
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Navigation, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'restaurant' | 'hotel' | 'attraction' | 'activity';
  rating?: number;
  photos?: string[];
}

interface MapViewProps {
  places: Place[];
  center?: [number, number];
  zoom?: number;
  showRoute?: boolean;
  onPlaceSelect?: (place: Place) => void;
}

export const MapView = ({ 
  places, 
  center = [40.7128, -74.0060], 
  zoom = 13,
  showRoute = false,
  onPlaceSelect
}: MapViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Generate route polyline from places
  const routeCoords = showRoute ? places.map(place => [place.lat, place.lng] as [number, number]) : [];

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    onPlaceSelect?.(place);
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'restaurant': return '#ef4444';
      case 'hotel': return '#3b82f6';
      case 'attraction': return '#10b981';
      case 'activity': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
            />
            <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
              <Navigation size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Place Markers */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            eventHandlers={{
              click: () => handlePlaceClick(place)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{place.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{place.type}</p>
                {place.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{place.rating}</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route Polyline */}
        {showRoute && routeCoords.length > 1 && (
          <Polyline
            positions={routeCoords}
            color="#ef4444"
            weight={3}
            opacity={0.7}
          />
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl p-3">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-white">Restaurants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-white">Hotels</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white">Attractions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-white">Activities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
