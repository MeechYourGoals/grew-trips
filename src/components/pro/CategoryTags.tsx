
import React from 'react';
import { ProTripCategory, getCategoryConfig } from '../../types/proCategories';

interface CategoryTagsProps {
  category: ProTripCategory;
  tags: string[];
  className?: string;
}

export const CategoryTags = ({ category, tags, className = '' }: CategoryTagsProps) => {
  const config = getCategoryConfig(category);
  
  // Combine category name with existing tags
  const allTags = [config.name, ...tags];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {allTags.map((tag, index) => (
        <span
          key={index}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            index === 0 
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
              : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};
