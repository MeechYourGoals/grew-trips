
import React, { useState } from 'react';
import { Crown } from 'lucide-react';
import { useConsumerSubscription } from '../../hooks/useConsumerSubscription';
import { TRIPS_PLUS_PRICE } from '../../types/consumer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export const ConsumerBillingSection = () => {
  const { subscription, isPlus, upgradeToPlus, isLoading } = useConsumerSubscription();
  const [expandedPlan, setExpandedPlan] = useState<string | null>(isPlus ? 'plus' : 'free');

  const plans = {
    free: {
      name: 'Free',
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
    plus: {
      name: 'Trips Plus',
      price: TRIPS_PLUS_PRICE,
      features: [
        'Everything in Free',
        'Junto Concierge AI Assistant',
        'Smart trip recommendations',
        'Basecamp-aware suggestions',
        'Group preference management',
        'Personalized itinerary building',
        'Priority support'
      ]
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Billing & Subscription</h3>
      
      {/* Current Plan */}
      <div className={`rounded-xl p-6 ${
        isPlus 
          ? 'bg-gradient-to-r from-glass-orange/10 to-glass-yellow/10 border border-glass-orange/20'
          : 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                {isPlus ? (
                  <>
                    Trips Plus
                    <Crown size={20} className="text-glass-orange" />
                  </>
                ) : (
                  'Free Plan'
                )}
              </h4>
              <p className={isPlus ? 'text-glass-orange' : 'text-blue-400'}>
                {isPlus ? 'Premium Features Active' : 'Free Forever'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              ${isPlus ? TRIPS_PLUS_PRICE : 0}/month
            </div>
            {isPlus && subscription?.status === 'trial' && (
              <div className="text-sm text-glass-yellow">Trial Active</div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h5 className="font-semibold text-white mb-3">Current Plan Features</h5>
          <ul className="space-y-2 text-sm text-gray-300">
            {plans[isPlus ? 'plus' : 'free'].features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                  isPlus ? 'bg-glass-orange' : 'bg-blue-400'
                }`}></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {!isPlus && (
          <button 
            onClick={upgradeToPlus}
            disabled={isLoading}
            className="bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Upgrade to Trips Plus'}
          </button>
        )}

        {isPlus && (
          <div className="flex gap-3">
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Manage Subscription
            </button>
            <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg font-medium transition-colors">
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Available Plans</h4>
        <div className="space-y-4">
          {Object.entries(plans).map(([key, plan]) => (
            <Collapsible key={key} open={expandedPlan === key} onOpenChange={() => setExpandedPlan(expandedPlan === key ? null : key)}>
              <CollapsibleTrigger className="w-full">
                <div className={`border rounded-lg p-4 transition-colors hover:bg-white/5 ${
                  (key === 'plus' && isPlus) || (key === 'free' && !isPlus)
                    ? 'border-glass-orange/50 bg-glass-orange/10'
                    : 'border-white/10 bg-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="text-left flex items-center gap-3">
                      <div>
                        <h5 className="font-semibold text-white flex items-center gap-2">
                          {plan.name}
                          {key === 'plus' && <Crown size={16} className="text-glass-orange" />}
                        </h5>
                        <div className="text-xl font-bold text-white">${plan.price}/month</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {((key === 'plus' && isPlus) || (key === 'free' && !isPlus)) && (
                        <div className="text-sm text-glass-orange font-medium">Current Plan</div>
                      )}
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
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-glass-orange rounded-full mt-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {key === 'plus' && !isPlus && (
                    <button 
                      onClick={upgradeToPlus}
                      disabled={isLoading}
                      className="mt-4 bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : `Upgrade to ${plan.name}`}
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
