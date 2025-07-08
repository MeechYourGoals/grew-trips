import React, { useState } from 'react';
import { MapPin, Users, Eye, EyeOff, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { LocationPermissionModal } from './LocationPermissionModal';
import { useLiveLocation } from '../hooks/useLiveLocation';
import { useRealtimeLocations } from '../hooks/useRealtimeLocations';
import { useAuth } from '../hooks/useAuth';
import { useTripVariant } from '../contexts/TripVariantContext';

interface FindMyFriendsOverlayProps {
  tripId: string;
  tripName: string;
  className?: string;
}

export const FindMyFriendsOverlay = ({ tripId, tripName, className }: FindMyFriendsOverlayProps) => {
  const { user } = useAuth();
  const { variant } = useTripVariant();
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showFriendLocations, setShowFriendLocations] = useState(true);

  // Only show for consumer trips
  if (variant !== 'consumer') {
    return null;
  }

  const {
    isSharing,
    error: locationError,
    permissionStatus
  } = useLiveLocation({
    tripId,
    enabled: isLocationEnabled && !!user,
    updateInterval: 10000 // 10 seconds
  });

  const { locations } = useRealtimeLocations({
    tripId,
    enabled: showFriendLocations
  });

  const handleToggleLocation = () => {
    if (!isLocationEnabled) {
      if (permissionStatus === 'unknown' || permissionStatus === 'prompt') {
        setShowPermissionModal(true);
      } else if (permissionStatus === 'granted') {
        setIsLocationEnabled(true);
      }
    } else {
      setIsLocationEnabled(false);
    }
  };

  const handleAcceptPermission = () => {
    setShowPermissionModal(false);
    setIsLocationEnabled(true);
  };

  const activeLocationsCount = locations.length;
  const myLocationShared = isSharing && isLocationEnabled;

  return (
    <>
      <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600/30 to-blue-700/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <MapPin size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Find My Friends</h3>
              <p className="text-gray-400 text-sm">
                {activeLocationsCount > 0 
                  ? `${activeLocationsCount} friend${activeLocationsCount !== 1 ? 's' : ''} sharing`
                  : 'No friends sharing location'
                }
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Settings size={16} />
          </Button>
        </div>

        <div className="space-y-3">
          {/* Share My Location Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${myLocationShared ? 'bg-green-400' : 'bg-gray-500'}`} />
              <div>
                <p className="text-white text-sm font-medium">Share my location</p>
                <p className="text-gray-400 text-xs">
                  {myLocationShared ? 'Currently sharing' : 'Not sharing'}
                </p>
              </div>
            </div>
            <Switch
              checked={isLocationEnabled}
              onCheckedChange={handleToggleLocation}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* Show Friends Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              {showFriendLocations ? (
                <Eye size={16} className="text-blue-400" />
              ) : (
                <EyeOff size={16} className="text-gray-500" />
              )}
              <div>
                <p className="text-white text-sm font-medium">Show friends</p>
                <p className="text-gray-400 text-xs">
                  {showFriendLocations ? 'Visible on map' : 'Hidden from map'}
                </p>
              </div>
            </div>
            <Switch
              checked={showFriendLocations}
              onCheckedChange={setShowFriendLocations}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* Error Display */}
          {locationError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{locationError}</p>
            </div>
          )}

          {/* Active Friends List */}
          {activeLocationsCount > 0 && showFriendLocations && (
            <div className="space-y-2">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                Active Now ({activeLocationsCount})
              </p>
              {locations.slice(0, 3).map((location) => (
                <div key={location.user_id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {location.user_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">
                      {location.user_name || 'Unknown User'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Updated {Math.round((Date.now() - new Date(location.updated_at).getTime()) / 1000)}s ago
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                </div>
              ))}
              {activeLocationsCount > 3 && (
                <p className="text-gray-400 text-xs text-center">
                  +{activeLocationsCount - 3} more on map
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onAccept={handleAcceptPermission}
        tripName={tripName}
      />
    </>
  );
};