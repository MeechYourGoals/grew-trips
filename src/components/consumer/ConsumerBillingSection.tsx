
import React, { useState } from 'react';
import { SUBSCRIPTION_TIERS } from '../../types/pro';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export const ConsumerBillingSection = () => {
  const [expandedPlan, setExpandedPlan] = useState<string | null>('individual');

  const consumerTiers = {
    individual: {
      name: 'Individual',
      price: 0,
      features: [
        'Create up to 3 trips',
        'Invite up to 10 people per trip',
        'Basic itinerary planning',
        'Photo sharing',
        'Basic chat functionality',
        'Mobile app access'
      ]
    },
    ...SUBSCRIPTION_TIERS
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Billing & Subscription</h3>
      
      {/* Current Plan */}
      <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-bold text-white">Individual Plan</h4>
            <p className="text-blue-400">Free Forever</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">$0/month</div>
          </div>
        </div>
        
        <div className="mb-6">
          <h5 className="font-semibold text-white mb-3">Current Plan Features</h5>
          <ul className="space-y-2 text-sm text-gray-300">
            {consumerTiers.individual.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Upgrade to Pro
        </button>
      </div>

      {/* Available Plans */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Available Plans</h4>
        <div className="space-y-4">
          {Object.entries(consumerTiers).map(([key, tier]) => (
            <Collapsible key={key} open={expandedPlan === key} onOpenChange={() => setExpandedPlan(expandedPlan === key ? null : key)}>
              <CollapsibleTrigger className="w-full">
                <div className={`border rounded-lg p-4 transition-colors hover:bg-white/5 ${
                  key === 'individual' ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10 bg-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h5 className="font-semibold text-white">{tier.name}</h5>
                      <div className="text-xl font-bold text-white">${tier.price}/month</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {key === 'individual' && <div className="text-sm text-blue-400 font-medium">Current Plan</div>}
                      <div className="text-gray-400">
                        {expandedPlan === key ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-white/5 rounded-lg p-4 ml-4">
                  <h6 className="font-medium text-white mb-3">Features Included:</h6>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-glass-orange rounded-full mt-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {key !== 'individual' && (
                    <button className="mt-4 bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Upgrade to {tier.name}
                    </button>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};
