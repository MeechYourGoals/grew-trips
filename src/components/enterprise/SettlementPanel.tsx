
import React, { useState } from 'react';
import { DollarSign, TrendingUp, Receipt, Calculator } from 'lucide-react';

export const SettlementPanel = () => {
  const [settlement] = useState({
    guaranteeFee: 150000,
    backendPercentage: 85,
    merchandiseRevenue: 45000,
    ticketRevenue: 280000,
    expenses: 35000,
    finalPayout: 253250
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calculator size={24} className="text-glass-orange" />
          Settlement & Revenue
        </h3>
        <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium">
          Calculate Settlement
        </button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-green-400" />
            <span className="text-sm text-gray-400">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${(settlement.ticketRevenue + settlement.merchandiseRevenue).toLocaleString()}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Receipt size={16} className="text-red-400" />
            <span className="text-sm text-gray-400">Total Expenses</span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${settlement.expenses.toLocaleString()}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-glass-orange" />
            <span className="text-sm text-gray-400">Final Payout</span>
          </div>
          <div className="text-2xl font-bold text-glass-orange">
            ${settlement.finalPayout.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Settlement Breakdown */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Settlement Breakdown</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Guarantee Fee</label>
              <input
                type="number"
                defaultValue={settlement.guaranteeFee}
                className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Backend Percentage (%)</label>
              <input
                type="number"
                defaultValue={settlement.backendPercentage}
                max="100"
                className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Ticket Revenue</label>
              <input
                type="number"
                defaultValue={settlement.ticketRevenue}
                className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Merchandise Revenue</label>
              <input
                type="number"
                defaultValue={settlement.merchandiseRevenue}
                className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Total Expenses</label>
            <input
              type="number"
              defaultValue={settlement.expenses}
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
        </div>
      </div>

      {/* Settlement History */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Recent Settlements</h4>
        <div className="space-y-3">
          {[
            { venue: 'Madison Square Garden', date: '2025-01-15', payout: 285000, status: 'paid' },
            { venue: 'Staples Center', date: '2025-01-10', payout: 253250, status: 'pending' },
            { venue: 'United Center', date: '2025-01-05', payout: 195000, status: 'paid' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">{item.venue}</div>
                <div className="text-sm text-gray-400">{item.date}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">${item.payout.toLocaleString()}</div>
                <div className={`text-sm ${
                  item.status === 'paid' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {item.status.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
