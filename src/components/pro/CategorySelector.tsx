
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ProTripCategory, getAllCategories, getCategoryConfig } from '../../types/proCategories';

interface CategorySelectorProps {
  selectedCategory: ProTripCategory;
  onCategoryChange: (category: ProTripCategory) => void;
  className?: string;
}

export const CategorySelector = ({ selectedCategory, onCategoryChange, className = '' }: CategorySelectorProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const categories = getAllCategories();

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-colors min-w-[200px] justify-between"
      >
        <span className="text-sm font-medium">{selectedCategory}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-[59]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu with higher z-index and better positioning */}
          <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-[60] overflow-hidden max-h-72 overflow-y-auto mb-20 touch-pan-y">
            {categories.map((category) => {
              const config = getCategoryConfig(category);
              return (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-700 border-b border-gray-700 last:border-b-0 ${
                    selectedCategory === category ? 'bg-gray-700 text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <div className="font-medium">{config.name}</div>
                  <div className="text-xs text-gray-400 mt-1 leading-relaxed">{config.description}</div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
