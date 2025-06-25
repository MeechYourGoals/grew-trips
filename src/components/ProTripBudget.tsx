
import React from 'react';
import { DollarSign } from 'lucide-react';
import { ProTripData } from '../data/proTripMockData';

interface ProTripBudgetProps {
  tripData: ProTripData;
}

export const ProTripBudget = ({ tripData }: ProTripBudgetProps) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="text-glass-green" size={24} />
        <h2 className="text-xl font-semibold text-white">Budget</h2>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Total Budget</span>
          <span className="text-white font-bold">${tripData.budget.total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">Spent</span>
          <span className="text-glass-orange font-bold">${tripData.budget.spent.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-glass-orange to-glass-yellow h-3 rounded-full transition-all duration-300"
            style={{ width: `${(tripData.budget.spent / tripData.budget.total) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-3">
        {tripData.budget.categories.map((category, index) => (
          <div key={index} className="p-3 bg-gray-800/50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{category.name}</span>
              <span className="text-gray-400 text-sm">
                ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-glass-yellow h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((category.spent / category.budgeted) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
