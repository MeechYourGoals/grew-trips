
import React from 'react';
import { CreditCard, Ticket, DollarSign, Users } from 'lucide-react';

export const TicketingBillingSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Ticketing & Billing System</h3>
      
      {/* Ticket Types */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Ticket size={20} />
          Ticket Types & Pricing
        </h4>
        <div className="space-y-4">
          {['Early Bird', 'General Admission', 'VIP', 'Student'].map((type, index) => (
            <div key={type} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Ticket Type</label>
                  <input 
                    type="text" 
                    defaultValue={type}
                    className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Price</label>
                  <input 
                    type="number" 
                    defaultValue={index === 0 ? '299' : index === 1 ? '399' : index === 2 ? '799' : '199'}
                    className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    defaultValue={index === 0 ? '100' : index === 1 ? '500' : index === 2 ? '50' : '200'}
                    className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Status</label>
                  <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
                    <option>Active</option>
                    <option>Sold Out</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full bg-glass-orange/20 hover:bg-glass-orange/30 text-glass-orange border border-glass-orange/30 rounded-lg py-3 font-medium">
            + Add New Ticket Type
          </button>
        </div>
      </div>

      {/* Payment Processing */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CreditCard size={20} />
          Payment Processing
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Payment Processor</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Stripe</option>
              <option>PayPal</option>
              <option>Square</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Currency</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>USD - US Dollar</option>
              <option>EUR - Euro</option>
              <option>GBP - British Pound</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Processing Fee</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Pass to Customer</option>
              <option>Absorb Fee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Tax Rate (%)</label>
            <input 
              type="number" 
              step="0.01"
              defaultValue="8.75"
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
        </div>
      </div>

      {/* Revenue Tracking */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign size={20} />
          Revenue Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-glass-orange">$127,450</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">847</div>
            <div className="text-sm text-gray-400">Tickets Sold</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">153</div>
            <div className="text-sm text-gray-400">Remaining</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">85%</div>
            <div className="text-sm text-gray-400">Sold Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
