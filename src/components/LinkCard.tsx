
import React, { useState } from 'react';
import { ExternalLink, MessageCircle, ThumbsUp, MoreHorizontal, User, Edit3 } from 'lucide-react';
import { Button } from './ui/button';

interface LinkPost {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'housing' | 'eats' | 'day-activities' | 'nightlife' | 'fitness' | 'reservations' | 'transportation' | 'essentials' | 'other';
  imageUrl?: string;
  postedBy: string;
  postedAt: string;
  upvotes: number;
  comments: number;
}

interface LinkCardProps {
  link: LinkPost;
}

export const LinkCard = ({ link }: LinkCardProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCategoryEdit, setShowCategoryEdit] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(link.category);

  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      'housing': { icon: '🏠', label: 'Housing', color: 'bg-green-600' },
      'eats': { icon: '🍽️', label: 'Eats', color: 'bg-orange-600' },
      'day-activities': { icon: '☀️', label: 'Day Activities', color: 'bg-yellow-600' },
      'nightlife': { icon: '🌙', label: 'Nightlife', color: 'bg-purple-600' },
      'fitness': { icon: '💪', label: 'Fitness', color: 'bg-red-600' },
      'reservations': { icon: '📅', label: 'Reservations', color: 'bg-blue-600' },
      'transportation': { icon: '✈️', label: 'Transportation', color: 'bg-indigo-600' },
      'essentials': { icon: '🎒', label: 'Essentials', color: 'bg-gray-600' },
      'other': { icon: '📎', label: 'Other', color: 'bg-slate-600' }
    };
    return categoryMap[category as keyof typeof categoryMap] || categoryMap['other'];
  };

  const allCategories = [
    { id: 'housing', label: 'Housing', icon: '🏠' },
    { id: 'eats', label: 'Eats', icon: '🍽️' },
    { id: 'day-activities', label: 'Day Activities', icon: '☀️' },
    { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
    { id: 'reservations', label: 'Reservations', icon: '📅' },
    { id: 'transportation', label: 'Transportation', icon: '✈️' },
    { id: 'essentials', label: 'Essentials', icon: '🎒' },
    { id: 'other', label: 'Other', icon: '📎' }
  ];

  const categoryInfo = getCategoryInfo(currentCategory);

  const handleCategoryChange = (newCategory: string) => {
    setCurrentCategory(newCategory as typeof currentCategory);
    setShowCategoryEdit(false);
    console.log('Category changed for link:', link.id, 'to:', newCategory);
    // Here you would update the database
  };

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden hover:border-slate-600/50 transition-colors">
      {/* Link Preview */}
      <div className="flex">
        {link.imageUrl && (
          <div className="w-24 h-24 sm:w-32 sm:h-24 flex-shrink-0">
            <img 
              src={link.imageUrl} 
              alt={link.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categoryInfo.color}`}>
                {categoryInfo.icon} {categoryInfo.label}
              </span>
              <button 
                onClick={() => setShowCategoryEdit(!showCategoryEdit)}
                className="text-slate-400 hover:text-white p-1"
                title="Change category"
              >
                <Edit3 size={12} />
              </button>
            </div>
            <button className="text-slate-400 hover:text-white">
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          {/* Category Edit Dropdown */}
          {showCategoryEdit && (
            <div className="mb-3 p-2 bg-slate-900/50 rounded-lg border border-slate-600">
              <div className="text-xs text-slate-400 mb-2">Change category:</div>
              <div className="grid grid-cols-2 gap-1">
                {allCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      currentCategory === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <h3 className="text-white font-medium mb-1 line-clamp-2">{link.title}</h3>
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{link.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <User size={14} />
                {link.postedBy}
              </div>
              <span>{link.postedAt}</span>
            </div>
            
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
            >
              <ExternalLink size={14} />
              View
            </a>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="px-4 py-3 bg-slate-900/30 border-t border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsUpvoted(!isUpvoted)}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isUpvoted ? 'text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ThumbsUp size={16} className={isUpvoted ? 'fill-current' : ''} />
              {link.upvotes + (isUpvoted ? 1 : 0)}
            </button>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <MessageCircle size={16} />
              {link.comments}
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 bg-slate-900/20 border-t border-slate-700/30">
          <div className="text-sm text-slate-400 mb-3">
            Comments coming soon...
          </div>
        </div>
      )}
    </div>
  );
};
