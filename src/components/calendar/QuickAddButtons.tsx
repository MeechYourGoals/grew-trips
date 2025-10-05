import React from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface QuickAddButtonsProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

export const QuickAddButtons = ({ categories, onSelectCategory }: QuickAddButtonsProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Add Event</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {categories.slice(0, 6).map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary text-foreground px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};
