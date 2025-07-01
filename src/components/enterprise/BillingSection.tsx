import React, { useState } from 'react';
import { CreditCard, Download, AlertCircle, Check } from 'lucide-react';
import { useTripVariant } from '../../contexts/TripVariantContext';
import { SUBSCRIPTION_TIERS } from '../../types/subscription';

interface BillingSectionProps {
  organizationId: string;
}

export const BillingSection = ({ organizationId }: BillingSectionProps) => {
  const { accentColors } = useTripVariant();
  const [currentPlan, setCurrentPlan] = useState<'starter' | 'growing' | 'enterprise' | 'enterprise-plus'>('starter');
  const [billingHistory, setBillingHistory] = useState([
    { id: '1', date: '2024-01-15', amount: 19.99, status: 'paid' },
    { id: '2', date: '2023-12-15', amount: 19.99, status: 'paid' },
    { id: '3', date: '2023-11-15', amount: 19.99, status: 'paid' }
  ]);

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Current Plan</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-white font-medium">{SUBSCRIPTION_TIERS[currentPlan].name}</h4>
            <p className="text-gray-400 text-sm">${SUBSCRIPTION_TIERS[currentPlan].price}/month • {SUBSCRIPTION_TIERS[currentPlan].seatLimit} seats</p>
          </div>
          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
            Active
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          {SUBSCRIPTION_TIERS[currentPlan].features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
              <Check size={14} className="text-green-400" />
              {feature}
            </div>
          ))}
        </div>

        <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg">
          Change Plan
        </button>
      </div>

      {/* Available Plans */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(SUBSCRIPTION_TIERS).map(([tier, details]) => (
            <div key={tier} className={`border rounded-xl p-4 ${
              currentPlan === tier 
                ? 'border-glass-orange bg-glass-orange/10' 
                : 'border-gray-600 bg-gray-800/30'
            }`}>
              <h4 className="text-white font-medium mb-2">{details.name}</h4>
              <p className="text-2xl font-bold text-white mb-1">${details.price}</p>
              <p className="text-gray-400 text-sm mb-4">{details.seatLimit} seats</p>
              
              <ul className="space-y-1 mb-4">
                {details.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="text-xs text-gray-300">• {feature}</li>
                ))}
                {details.features.length > 3 && (
                  <li className="text-xs text-gray-400">+ {details.features.length - 3} more...</li>
                )}
              </ul>
              
              {currentPlan !== tier && (
                <button className="w-full bg-glass-orange hover:bg-glass-orange/80 text-white py-2 rounded-lg text-sm">
                  {details.price > SUBSCRIPTION_TIERS[currentPlan].price ? 'Upgrade' : 'Downgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Billing History</h3>
        {billingHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400">
                  <th className="py-2">Date</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item) => (
                  <tr key={item.id} className="text-white">
                    <td className="py-3">{item.date}</td>
                    <td className="py-3">${item.amount}</td>
                    <td className="py-3">
                      {item.status === 'paid' ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <Check size={14} />
                          Paid
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertCircle size={14} />
                          {item.status}
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <button className="text-glass-orange hover:text-glass-orange/80">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No billing history available.</p>
        )}
      </div>
    </div>
  );
};
