
import React, { useState } from 'react';
import { X, Link, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { BasecampLocation, PlaceWithDistance } from '../types/basecamp';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceAdded?: (place: PlaceWithDistance) => void;
  basecamp?: BasecampLocation;
}

const categories = [
  { id: 'restaurant', label: 'Eats', icon: '🍽️', description: 'Restaurants, cafes, food tours' },
  { id: 'attraction', label: 'Attraction / Sightseeing', icon: '🎯', description: 'Museums, tours, attractions' },
  { id: 'activity', label: 'Day Activities', icon: '☀️', description: 'Activities and experiences' },
  { id: 'fitness', label: 'Fitness', icon: '💪', description: 'Gyms, yoga, sports activities' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙', description: 'Bars, clubs, evening events' },
  { id: 'transportation', label: 'Transportation', icon: '✈️', description: 'Flights, cars, rideshares' },
  { id: 'hotel', label: 'Housing', icon: '🏠', description: 'Hotels, Airbnbs, hostels' }
];

export const AddPlaceModal = ({ isOpen, onClose, onPlaceAdded, basecamp }: AddPlaceModalProps) => {
  const [url, setUrl] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [calculateDistance, setCalculateDistance] = useState(!!basecamp);
  const [category, setCategory] = useState<string>('');
  const [useAiSorting, setUseAiSorting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const classifyPlace = async (url: string, title: string): Promise<string> => {
    const text = `${title} ${url}`.toLowerCase();
    
    if (text.includes('airbnb') || text.includes('hotel') || text.includes('hostel') || 
        text.includes('apartment') || text.includes('accommodation') || text.includes('booking.com')) {
      return 'hotel';
    }
    
    if (text.includes('flight') || text.includes('airline') || text.includes('airport') ||
        text.includes('uber') || text.includes('lyft') || text.includes('rental car')) {
      return 'transportation';
    }
    
    if (text.includes('restaurant') || text.includes('cafe') || text.includes('food') || 
        text.includes('dining') || text.includes('michelin')) {
      return 'restaurant';
    }
    
    if (text.includes('bar') || text.includes('club') || text.includes('nightlife') || 
        text.includes('cocktail') || text.includes('pub')) {
      return 'nightlife';
    }
    
    if (text.includes('gym') || text.includes('fitness') || text.includes('yoga') || 
        text.includes('workout') || text.includes('sports')) {
      return 'fitness';
    }
    
    if (text.includes('museum') || text.includes('tour') || text.includes('attraction') || 
        text.includes('activity') || text.includes('experience')) {
      return 'attraction';
    }
    
    return 'attraction';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setIsLoading(true);
    try {
      let finalCategory = category;
      
      if (!category && useAiSorting) {
        finalCategory = await classifyPlace(url, placeName);
      }
      
      if (!finalCategory) {
        finalCategory = 'attraction';
      }

      const newPlace: PlaceWithDistance = {
        id: Date.now().toString(),
        name: placeName.trim() || 'New Place',
        url: url.trim(),
        category: finalCategory as any,
        calculatedAt: new Date().toISOString()
      };

      console.log('Adding place:', { 
        place: newPlace, 
        calculateDistance, 
        hasBasecamp: !!basecamp 
      });
      
      if (onPlaceAdded) {
        onPlaceAdded(newPlace);
      }
      
      // Reset form and close modal
      setUrl('');
      setPlaceName('');
      setCalculateDistance(!!basecamp);
      setCategory('');
      setUseAiSorting(false);
      onClose();
    } catch (error) {
      console.error('Error adding place:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Add Place</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Place URL *
            </label>
            <div className="relative">
              <Link size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Place Name *
            </label>
            <input
              type="text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="Give this place a name..."
              required
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* AI Sorting Toggle */}
          <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg border border-slate-700/50">
            <input
              type="checkbox"
              id="ai-sorting"
              checked={useAiSorting}
              onChange={(e) => setUseAiSorting(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="ai-sorting" className="flex items-center gap-2 text-sm text-slate-300">
              <Sparkles size={16} className="text-blue-400" />
              Let AI categorize this place automatically
            </label>
          </div>

          {/* Category Selection */}
          {!useAiSorting && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Category (optional)
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id === category ? '' : cat.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      category === cat.id
                        ? 'bg-blue-600/20 border-blue-600 text-white'
                        : 'bg-slate-900/30 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <div className="font-medium">{cat.label}</div>
                      <div className="text-xs text-slate-400">{cat.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Distance Calculation Toggle */}
          {basecamp && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Calculate distance from Basecamp</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={calculateDistance}
                    onChange={(e) => setCalculateDistance(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              <p className="text-xs text-green-300">
                See how far your options are from your base
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !url.trim() || !placeName.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Adding...' : 'Add Place'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
