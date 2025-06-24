
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryEventFormsProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: any) => void;
  selectedDate?: Date;
}

export const CategoryEventForms = ({ category, isOpen, onClose, onSubmit, selectedDate }: CategoryEventFormsProps) => {
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    location: '',
    description: '',
    // Category-specific fields
    checkInTime: '',
    checkOutTime: '',
    bookingReference: '',
    cuisine: '',
    dietaryRestrictions: '',
    priceRange: '',
    duration: '',
    difficulty: '',
    equipmentNeeded: '',
    dressCode: '',
    coverCharge: '',
    ageRequirement: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      time: '',
      location: '',
      description: '',
      checkInTime: '',
      checkOutTime: '',
      bookingReference: '',
      cuisine: '',
      dietaryRestrictions: '',
      priceRange: '',
      duration: '',
      difficulty: '',
      equipmentNeeded: '',
      dressCode: '',
      coverCharge: '',
      ageRequirement: ''
    });
  };

  const renderCategorySpecificFields = () => {
    switch (category.id) {
      case 'accommodations':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="time"
                placeholder="Check-in time"
                value={formData.checkInTime}
                onChange={(e) => setFormData({...formData, checkInTime: e.target.value})}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
              />
              <input
                type="time"
                placeholder="Check-out time"
                value={formData.checkOutTime}
                onChange={(e) => setFormData({...formData, checkOutTime: e.target.value})}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
            <input
              type="text"
              placeholder="Booking reference"
              value={formData.bookingReference}
              onChange={(e) => setFormData({...formData, bookingReference: e.target.value})}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </>
        );
      
      case 'food':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Cuisine type"
                value={formData.cuisine}
                onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
              >
                <option value="">Price range</option>
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Expensive)</option>
                <option value="$$$$">$$$$ (Very Expensive)</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Dietary restrictions"
              value={formData.dietaryRestrictions}
              onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </>
        );

      case 'transportation':
        return (
          <input
            type="text"
            placeholder="Booking reference / Flight number"
            value={formData.bookingReference}
            onChange={(e) => setFormData({...formData, bookingReference: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
          />
        );

      case 'fitness':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Duration (e.g., 2 hours)"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
              >
                <option value="">Difficulty</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Equipment needed"
              value={formData.equipmentNeeded}
              onChange={(e) => setFormData({...formData, equipmentNeeded: e.target.value})}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </>
        );

      case 'nightlife':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Dress code"
                value={formData.dressCode}
                onChange={(e) => setFormData({...formData, dressCode: e.target.value})}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                placeholder="Cover charge"
                value={formData.coverCharge}
                onChange={(e) => setFormData({...formData, coverCharge: e.target.value})}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <input
              type="text"
              placeholder="Age requirement"
              value={formData.ageRequirement}
              onChange={(e) => setFormData({...formData, ageRequirement: e.target.value})}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="text-xl font-semibold text-white">
              Add {category.name} Event
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {selectedDate && (
          <div className="mb-4 text-sm text-gray-400">
            Date: {selectedDate.toLocaleDateString()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common fields */}
          <input
            type="text"
            placeholder="Event title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
          />
          
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            required
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
          />
          
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
          />

          {/* Category-specific fields */}
          {renderCategorySpecificFields()}
          
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-none"
          />
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 rounded-lg transition-colors"
            >
              Add Event
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
