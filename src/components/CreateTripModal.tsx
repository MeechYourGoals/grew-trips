
import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Building, PartyPopper } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTripModal = ({ isOpen, onClose }: CreateTripModalProps) => {
  const [tripType, setTripType] = useState<'consumer' | 'pro' | 'event'>('consumer');
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating trip:', formData);
    // Here you would typically send the data to your backend
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Trip</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Trip Type Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Trip Type
          </label>
          <ToggleGroup
            type="single"
            value={tripType}
            onValueChange={(value) => value && setTripType(value as 'consumer' | 'pro' | 'event')}
            className="grid grid-cols-3 gap-2 bg-slate-700/30 p-1 rounded-xl"
          >
            <ToggleGroupItem
              value="consumer"
              className="flex items-center gap-2 data-[state=on]:bg-blue-600 data-[state=on]:text-white text-slate-300 hover:text-white"
            >
              <Users size={16} />
              Consumer
            </ToggleGroupItem>
            <ToggleGroupItem
              value="pro"
              className="flex items-center gap-2 data-[state=on]:bg-blue-600 data-[state=on]:text-white text-slate-300 hover:text-white"
            >
              <Building size={16} />
              Pro
            </ToggleGroupItem>
            <ToggleGroupItem
              value="event"
              className="flex items-center gap-2 data-[state=on]:bg-blue-600 data-[state=on]:text-white text-slate-300 hover:text-white"
            >
              <PartyPopper size={16} />
              Event
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trip Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Trip Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="e.g., Summer in Paris"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <MapPin size={16} />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="e.g., Paris, France"
              required
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your trip..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Create Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
