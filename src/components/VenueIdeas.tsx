
import React, { useState } from 'react';
import { Plus, MapPin, Clock, User, MessageCircle, ThumbsUp, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { AddLinkModal } from './AddLinkModal';
import { LinkCard } from './LinkCard';

interface LinkPost {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'housing' | 'eats' | 'day-activities' | 'nightlife' | 'fitness';
  imageUrl?: string;
  postedBy: string;
  postedAt: string;
  upvotes: number;
  comments: number;
}

// Mock data for demonstration
const mockLinks: LinkPost[] = [
  {
    id: '1',
    title: 'Charming 3BR Apartment in Montmartre',
    url: 'https://airbnb.com/rooms/123',
    description: 'Beautiful apartment with Eiffel Tower views, perfect for groups',
    category: 'housing',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=200&fit=crop',
    postedBy: 'Emma',
    postedAt: '2 hours ago',
    upvotes: 8,
    comments: 3
  },
  {
    id: '2',
    title: 'L\'Ami Jean - Traditional Bistro',
    url: 'https://example.com/restaurant',
    description: 'Highly rated traditional French bistro in the 7th arrondissement',
    category: 'eats',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop',
    postedBy: 'Jake',
    postedAt: '4 hours ago',
    upvotes: 12,
    comments: 5
  },
  {
    id: '3',
    title: 'Seine River Cruise',
    url: 'https://example.com/cruise',
    description: 'Evening cruise with dinner and city lights',
    category: 'day-activities',
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=200&fit=crop',
    postedBy: 'Sarah',
    postedAt: '1 day ago',
    upvotes: 6,
    comments: 2
  }
];

const categories = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'housing', label: 'Housing', icon: '🏠' },
  { id: 'eats', label: 'Eats', icon: '🍽️' },
  { id: 'day-activities', label: 'Day Activities', icon: '☀️' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { id: 'fitness', label: 'Fitness', icon: '💪' }
];

export const VenueIdeas = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLinks = mockLinks.filter(link => {
    const matchesCategory = activeCategory === 'all' || link.category === activeCategory;
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Ideas & Links</h2>
          <p className="text-slate-400 text-sm">Share and discover places to visit</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add Link
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <span>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Links Feed */}
      <div className="space-y-4">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-2">
              {activeCategory === 'all' ? 'No ideas yet' : `No ${categories.find(c => c.id === activeCategory)?.label.toLowerCase()} ideas yet`}
            </div>
            <div className="text-slate-500">
              {activeCategory === 'all' 
                ? 'Start sharing links to restaurants, activities, and places to visit!'
                : `Be the first to suggest some ${categories.find(c => c.id === activeCategory)?.label.toLowerCase()} options!`
              }
            </div>
          </div>
        )}
      </div>

      <AddLinkModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};
