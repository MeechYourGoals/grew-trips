
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { ProTripData } from '../data/proTripMockData';

interface ProTripBudgetDetailedProps {
  tripData: ProTripData;
}

export const ProTripBudgetDetailed = ({ tripData }: ProTripBudgetDetailedProps) => {
  const totalBudgeted = tripData.budget.categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = tripData.budget.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = tripData.budget.total - tripData.budget.spent;
  const remainingPercentage = (remaining / tripData.budget.total) * 100;

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <DollarSign className="text-glass-green" size={28} />
        <h2 className="text-2xl font-semibold text-white">Budget Breakdown</h2>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-glass-green/20 to-glass-yellow/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-glass-green" size={20} />
            <span className="text-white font-medium">Total Budget</span>
          </div>
          <div className="text-2xl font-bold text-white">${tripData.budget.total.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-glass-orange/20 to-glass-yellow/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-glass-orange" size={20} />
            <span className="text-white font-medium">Total Spent</span>
          </div>
          <div className="text-2xl font-bold text-white">${tripData.budget.spent.toLocaleString()}</div>
          <div className="text-glass-orange/80 text-sm mt-1">
            {((tripData.budget.spent / tripData.budget.total) * 100).toFixed(1)}% of budget
          </div>
        </div>

        <div className="bg-gradient-to-br from-glass-blue/20 to-glass-green/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="text-glass-blue" size={20} />
            <span className="text-white font-medium">Remaining</span>
          </div>
          <div className="text-2xl font-bold text-white">${remaining.toLocaleString()}</div>
          <div className="text-glass-blue/80 text-sm mt-1">
            {remainingPercentage.toFixed(1)}% remaining
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">Overall Budget Progress</span>
          <span className="text-gray-400">{((tripData.budget.spent / tripData.budget.total) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-glass-orange to-glass-yellow h-4 rounded-full transition-all duration-500"
            style={{ width: `${(tripData.budget.spent / tripData.budget.total) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white mb-4">Category Breakdown</h3>
        {tripData.budget.categories.map((category, index) => {
          const percentage = (category.spent / category.budgeted) * 100;
          const isOverBudget = category.spent > category.budgeted;
          
          return (
            <div key={index} className="bg-gray-800/50 border border-gray-600 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-white">{category.name}</h4>
                  {isOverBudget && (
                    <AlertCircle className="text-red-400" size={20} />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
                  </div>
                  <div className={`text-sm ${isOverBudget ? 'text-red-400' : 'text-gray-400'}`}>
                    {percentage.toFixed(1)}% {isOverBudget ? 'over budget' : 'of budget'}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    isOverBudget 
                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                      : 'bg-gradient-to-r from-glass-green to-glass-yellow'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              
              {isOverBudget && (
                <div className="mt-2 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={14} />
                  Over budget by ${(category.spent - category.budgeted).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
