
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
        <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden">
          {categories.map((category) => {
            const config = getCategoryConfig(category);
            return (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-700 ${
                  selectedCategory === category ? 'bg-gray-700 text-yellow-400' : 'text-gray-300'
                }`}
              >
                <div className="font-medium">{config.name}</div>
                <div className="text-xs text-gray-400 mt-1">{config.description}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
