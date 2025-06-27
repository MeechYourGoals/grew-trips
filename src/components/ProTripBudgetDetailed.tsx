
import React from 'react';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { ProTripData } from '../data/proTripMockData';

interface ProTripBudgetDetailedProps {
  tripData: ProTripData;
}

export const ProTripBudgetDetailed = ({ tripData }: ProTripBudgetDetailedProps) => {
  const budgetPercentage = (tripData.budget.spent / tripData.budget.total) * 100;

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="text-glass-green" size={24} />
        <h2 className="text-xl font-semibold text-white">Detailed Budget</h2>
      </div>
      
      {/* Overall Budget Summary */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              ${tripData.budget.total.toLocaleString()}
            </div>
            <div className="text-gray-400">Total Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-glass-orange mb-1">
              ${tripData.budget.spent.toLocaleString()}
            </div>
            <div className="text-gray-400">Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-glass-green mb-1">
              ${(tripData.budget.total - tripData.budget.spent).toLocaleString()}
            </div>
            <div className="text-gray-400">Remaining</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Overall Progress</span>
            <span className="text-white font-medium">{budgetPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                budgetPercentage > 90 ? 'bg-red-500' : 
                budgetPercentage > 75 ? 'bg-yellow-500' : 
                'bg-gradient-to-r from-glass-green to-glass-yellow'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Category Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Category Breakdown</h3>
        {tripData.budget.categories.map((category, index) => {
          const categoryPercentage = (category.spent / category.budgeted) * 100;
          const isOverBudget = categoryPercentage > 100;
          
          return (
            <div key={index} className="bg-gray-800/30 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{category.name}</span>
                  {isOverBudget && (
                    <AlertCircle className="text-red-400" size={16} />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
                  </div>
                  <div className={`text-sm ${isOverBudget ? 'text-red-400' : 'text-gray-400'}`}>
                    {categoryPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isOverBudget ? 'bg-red-500' : 
                    categoryPercentage > 90 ? 'bg-yellow-500' : 
                    'bg-glass-yellow'
                  }`}
                  style={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Remaining: ${Math.max(0, category.budgeted - category.spent).toLocaleString()}</span>
                {isOverBudget && (
                  <span className="text-red-400">
                    Over by: ${(category.spent - category.budgeted).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Budget Insights */}
      <div className="mt-6 p-4 bg-glass-yellow/10 border border-glass-yellow/30 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="text-glass-yellow" size={16} />
          <span className="text-glass-yellow font-medium">Budget Insights</span>
        </div>
        <div className="text-sm text-gray-300">
          {budgetPercentage > 90 ? 
            "You're approaching your budget limit. Consider reviewing expenses." :
            budgetPercentage > 75 ?
            "You're on track with your budget. Monitor upcoming expenses." :
            "Your budget is healthy with room for additional expenses."
          }
        </div>
      </div>
    </div>
  );
};
