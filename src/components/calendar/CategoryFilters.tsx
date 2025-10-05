import React from 'react';
import { Filter } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryFiltersProps {
  categories: Category[];
  selectedFilter: string | null;
  onFilterChange: (categoryId: string | null) => void;
}

export const CategoryFilters = ({ categories, selectedFilter, onFilterChange }: CategoryFiltersProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Filter by Category</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange(null)}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            selectedFilter === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          All Categories
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedFilter === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};
