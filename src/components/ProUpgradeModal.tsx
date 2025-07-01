import React from 'react';
import { X, Crown, Check } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '../types/subscription';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProUpgradeModal = ({ isOpen, onClose }: ProUpgradeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h2>
            <p className="text-gray-400">Unlock professional trip management features</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(SUBSCRIPTION_TIERS).map(([tier, details]) => (
              <div key={tier} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown size={20} className="text-yellow-500" />
                  <h3 className="text-lg font-semibold text-white">{details.name}</h3>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">${details.price}</span>
                  <span className="text-gray-400 text-sm">/month for up to {details.seatLimit} seats</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {details.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-medium py-3 rounded-xl transition-all duration-300">
                  {details.features.length > 8 ? 'Contact Sales' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
