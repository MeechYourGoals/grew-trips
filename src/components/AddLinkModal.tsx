
import React, { useState } from 'react';
import { X, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { id: 'housing', label: 'Housing', icon: '🏠', description: 'Hotels, Airbnbs, hostels' },
  { id: 'eats', label: 'Eats', icon: '🍽️', description: 'Restaurants, cafes, food tours' },
  { id: 'day-activities', label: 'Day Activities', icon: '☀️', description: 'Museums, tours, attractions' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙', description: 'Bars, clubs, evening events' },
  { id: 'fitness', label: 'Fitness', icon: '💪', description: 'Gyms, yoga, sports activities' }
];

export const AddLinkModal = ({ isOpen, onClose }: AddLinkModalProps) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [useAiSorting, setUseAiSorting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalCategory = selectedCategory;
      
      // If no category selected and AI sorting is enabled, classify the link
      if (!selectedCategory && useAiSorting) {
        finalCategory = await classifyLink(url, title, description);
      }
      
      // If still no category, default to 'eats'
      if (!finalCategory) {
        finalCategory = 'eats';
      }

      console.log('Adding link:', { url, title, description, category: finalCategory });
      
      // Here you would normally save to your database
      // For now, just close the modal
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const classifyLink = async (url: string, title: string, description: string): Promise<string> => {
    // Simple keyword-based classification for now
    const text = `${title} ${description} ${url}`.toLowerCase();
    
    if (text.includes('airbnb') || text.includes('hotel') || text.includes('hostel') || text.includes('apartment') || text.includes('accommodation')) {
      return 'housing';
    }
    if (text.includes('restaurant') || text.includes('cafe') || text.includes('food') || text.includes('menu') || text.includes('dining')) {
      return 'eats';
    }
    if (text.includes('bar') || text.includes('club') || text.includes('nightlife') || text.includes('cocktail') || text.includes('pub')) {
      return 'nightlife';
    }
    if (text.includes('gym') || text.includes('fitness') || text.includes('yoga') || text.includes('workout') || text.includes('sports')) {
      return 'fitness';
    }
    if (text.includes('museum') || text.includes('tour') || text.includes('attraction') || text.includes('activity') || text.includes('experience')) {
      return 'day-activities';
    }
    
    // Default to eats if unsure
    return 'eats';
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setDescription('');
    setSelectedCategory('');
    setUseAiSorting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Add Link</h2>
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
              Link URL *
            </label>
            <div className="relative">
              <LinkIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
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
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this link a title..."
              required
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some context or notes..."
              rows={3}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
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
              Let AI categorize this link automatically
            </label>
          </div>

          {/* Category Selection */}
          {!useAiSorting && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Category (optional)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id === selectedCategory ? '' : category.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600/20 border-blue-600 text-white'
                        : 'bg-slate-900/30 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-xs text-slate-400">{category.description}</div>
                    </div>
                  </button>
                ))}
              </div>
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
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Adding...' : 'Add Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
