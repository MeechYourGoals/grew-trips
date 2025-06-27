
import React, { useState } from 'react';
import { MapPin, Home, X } from 'lucide-react';
import { Button } from './ui/button';
import { BasecampLocation } from '../types/basecamp';
import { DistanceCalculator } from '../utils/distanceCalculator';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setIsLoading(true);
    try {
      const coordinates = await DistanceCalculator.geocodeAddress(address);
      
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
        alert('Could not find the address. Please check and try again.');
      }
    } catch (error) {
      console.error('Error setting basecamp:', error);
      alert('Error setting basecamp. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Basecamp Address *
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter hotel, Airbnb, or main lodging address..."
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />
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
              💡 Your basecamp will be used to calculate distances to all places you add to this trip.
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
