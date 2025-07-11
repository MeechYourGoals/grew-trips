import React, { useState } from 'react';
import { Search, Users, MapPin, Clock, Settings, Eye, EyeOff } from 'lucide-react';
import { useLiveLocation } from '../hooks/useLiveLocation';
import { useRealtimeLocations } from '../hooks/useRealtimeLocations';
import { useAuth } from '../hooks/useAuth';
import { LocationPermissionModal } from './LocationPermissionModal';

interface EnhancedFindMyFriendsProps {
  tripId: string;
  tripName: string;
}

export const EnhancedFindMyFriends = ({ tripId, tripName }: EnhancedFindMyFriendsProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showOfflineFriends, setShowOfflineFriends] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  const { 
    isSharing, 
    startSharing,
    stopSharing,
    error: locationError 
  } = useLiveLocation({ tripId, enabled: true });
  
  const { 
    locations: friendLocations
  } = useRealtimeLocations({ tripId, enabled: true });

  const activeFriends = friendLocations.filter(loc => 
    Date.now() - new Date(loc.updated_at).getTime() < 10 * 60 * 1000
  );

  const inactiveFriends = friendLocations.filter(loc => 
    Date.now() - new Date(loc.updated_at).getTime() >= 10 * 60 * 1000
  );

  const filteredActiveFriends = activeFriends.filter(friend =>
    friend.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInactiveFriends = showOfflineFriends ? inactiveFriends.filter(friend =>
    friend.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleToggleLocation = async () => {
    try {
      if (isSharing) {
        stopSharing();
      } else {
        await startSharing();
      }
    } catch (error) {
      setShowPermissionModal(true);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl shadow-black/50 min-h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Find My Friends</h3>
            <p className="text-gray-400 text-sm">{activeFriends.length} online now</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </div>

      {/* Location Sharing Toggle */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin size={18} className={isSharing ? "text-green-400" : "text-gray-400"} />
            <div>
              <p className="text-white font-medium">Share My Location</p>
              <p className="text-gray-400 text-sm">
                {isSharing ? 'Others can see your location' : 'Your location is private'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleLocation}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              isSharing ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
              isSharing ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
        {locationError && (
          <p className="text-red-400 text-sm mt-2">Failed to update location sharing</p>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <button
          onClick={() => setShowOfflineFriends(!showOfflineFriends)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          {showOfflineFriends ? <Eye size={16} /> : <EyeOff size={16} />}
          {showOfflineFriends ? 'Hide offline friends' : 'Show offline friends'}
        </button>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {/* Active Friends */}
        {filteredActiveFriends.map((friend) => (
          <div key={friend.user_id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {friend.user_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{friend.user_name}</p>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Online now
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(friend.updated_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Offline Friends */}
        {filteredInactiveFriends.map((friend) => (
          <div key={friend.user_id} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 opacity-60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-gray-300 font-medium text-sm">
                    {friend.user_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">{friend.user_name}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    Offline
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(friend.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {filteredActiveFriends.length === 0 && filteredInactiveFriends.length === 0 && (
          <div className="text-center py-8">
            <Users size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              {searchQuery ? 'No friends match your search' : 'No friends are sharing their location yet'}
            </p>
          </div>
        )}
      </div>

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onAccept={() => {
          setShowPermissionModal(false);
          handleToggleLocation();
        }}
        tripName={tripName}
      />
    </div>
  );
};