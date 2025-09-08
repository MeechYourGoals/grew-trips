import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Home, X } from 'lucide-react';
import { Button } from './ui/button';
import { BasecampLocation } from '../types/basecamp';
import { GoogleMapsService } from '../services/googleMapsService';

interface BasecampSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onBasecampSet: (basecamp: BasecampLocation) => void;
  currentBasecamp?: BasecampLocation;
}

export const BasecampSelector = ({ isOpen, onClose, onBasecampSet, currentBasecamp }: BasecampSelectorProps) => {
  const [address, setAddress] = useState(currentBasecamp?.address || '');
  const [name, setName] = useState(currentBasecamp?.name || '');
  const [type, setType] = useState<'hotel' | 'airbnb' | 'other'>(currentBasecamp?.type || 'hotel');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Enhanced address input with Google Places autocomplete
  const handleAddressChange = async (value: string) => {
    setAddress(value);
    setSelectedSuggestionIndex(-1);
    
    if (value.length > 2) {
      setIsLoadingSuggestions(true);
      try {
        // Prioritize establishments (hotels, venues, landmarks) and then general geocoding
        const result = await GoogleMapsService.getPlaceAutocomplete(value, ['establishment', 'lodging', 'tourist_attraction', 'geocode']);
        if (result.predictions && result.predictions.length > 0) {
          setSuggestions(result.predictions.slice(0, 8));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error getting suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion: any) => {
    setAddress(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // If it's a place with a place_id, try to get more details
    if (suggestion.place_id) {
      try {
        const placeDetails = await GoogleMapsService.getPlaceDetailsById(suggestion.place_id);
        if (placeDetails && placeDetails.result) {
          const place = placeDetails.result;
          // Auto-fill name if not already set
          if (!name && place.name) {
            setName(place.name);
          }
          // Auto-detect type based on place types
          if (!type && place.types && place.types.length > 0) {
            const placeType = place.types.includes('lodging') ? 'hotel' :
                            place.types.includes('tourist_attraction') ? 'other' :
                            place.types.includes('restaurant') ? 'other' : type;
            setType(placeType);
          }
        }
      } catch (error) {
        console.error('Error getting place details:', error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setIsLoading(true);
    setShowSuggestions(false);
    
    try {
      const coordinates = await GoogleMapsService.geocodeAddress(address);
      
      if (coordinates) {
        const basecamp: BasecampLocation = {
          address: address.trim(),
          coordinates,
          name: name.trim() || undefined,
          type
        };
        
        onBasecampSet(basecamp);
        onClose();
      } else {
        alert('Could not find that address. Please try selecting from the suggestions or enter a different location.');
      }
    } catch (error) {
      console.error('Error setting basecamp:', error);
      alert('There was an error setting your basecamp. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {currentBasecamp ? 'Update Basecamp' : 'Set Basecamp'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors border border-gray-700"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="relative">
            <label className="block text-sm font-semibold text-white mb-2">
              Basecamp Address *
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input
                ref={inputRef}
                type="text"
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Enter hotel, Airbnb, or main lodging address..."
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                autoComplete="off"
              />
              
              {/* Autocomplete Suggestions */}
              {(showSuggestions || isLoadingSuggestions) && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-xl mt-1 shadow-lg z-20 max-h-60 overflow-y-auto"
                >
                  {isLoadingSuggestions ? (
                    <div className="px-4 py-3 text-gray-400 text-sm">
                      Loading suggestions...
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => {
                      // Determine place type for visual indication
                      const types = suggestion.types || [];
                      const getPlaceTypeIcon = () => {
                        if (types.includes('lodging')) return { icon: '🏨', label: 'Hotel', color: 'bg-blue-100 text-blue-800' };
                        if (types.includes('tourist_attraction')) return { icon: '🎯', label: 'Attraction', color: 'bg-green-100 text-green-800' };
                        if (types.includes('stadium')) return { icon: '🏟️', label: 'Stadium', color: 'bg-purple-100 text-purple-800' };
                        if (types.includes('establishment')) return { icon: '📍', label: 'Place', color: 'bg-gray-100 text-gray-800' };
                        return null;
                      };
                      
                      const placeType = getPlaceTypeIcon();
                      
                      return (
                        <button
                          key={suggestion.place_id || index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white text-sm flex items-center gap-3 ${
                            index === selectedSuggestionIndex ? 'bg-gray-700' : ''
                          }`}
                        >
                          <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium truncate">
                                {suggestion.structured_formatting?.main_text || suggestion.description}
                              </span>
                              {placeType && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${placeType.color} flex-shrink-0`}>
                                  {placeType.icon} {placeType.label}
                                </span>
                              )}
                            </div>
                            {suggestion.structured_formatting?.secondary_text && (
                              <div className="text-xs text-gray-500 truncate">
                                {suggestion.structured_formatting.secondary_text}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Basecamp Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 'Grand Hotel Paris' or 'Downtown Airbnb'"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'hotel' | 'airbnb' | 'other')}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
            >
              <option value="hotel">Hotel</option>
              <option value="airbnb">Airbnb / Vacation Rental</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-sm text-green-300">
              💡 Your basecamp will be used as the starting point for directions and calculating distances to places.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-2 border-gray-700 hover:border-gray-600 font-semibold bg-gray-800 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !address.trim()}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 font-semibold shadow-lg shadow-green-500/25 border border-green-500/50"
            >
              {isLoading ? 'Setting...' : (currentBasecamp ? 'Update' : 'Set Basecamp')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};