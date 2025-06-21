
import React, { useState } from 'react';
import { X, MapPin, Link, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPlaceModal = ({ isOpen, onClose }: AddPlaceModalProps) => {
  const [url, setUrl] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setIsLoading(true);
    try {
      // Here you would normally save to your backend
      console.log('Adding place:', { url, placeName });
      
      // Reset form and close modal
      setUrl('');
      setPlaceName('');
      onClose();
    } catch (error) {
      console.error('Error adding place:', error);
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
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <MapPin size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add Place</h2>
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
              Place URL *
            </label>
            <div className="relative">
              <Link size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste URL here (Google Maps, TripAdvisor, etc.)"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Place Name (optional)
            </label>
            <input
              type="text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="Give this place a custom name..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
            />
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
              disabled={isLoading || !url.trim()}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-semibold shadow-lg shadow-red-500/25 border border-red-500/50"
            >
              {isLoading ? 'Adding...' : 'Add Place'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
