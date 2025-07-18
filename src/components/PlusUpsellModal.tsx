import React from 'react';
import { X, Crown, Sparkles, MessageCircle, Settings, Zap } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TRIPS_PLUS_PRICE } from '../types/consumer';

interface PlusUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlusUpsellModal = ({ isOpen, onClose }: PlusUpsellModalProps) => {
  const { upgradeToPlus, isLoading } = useConsumerSubscription();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    await upgradeToPlus();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-2xl flex items-center justify-center">
              <Crown size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Upgrade to Plus</h2>
              <p className="text-gray-400">AI-powered travel planning for smarter trips</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Concierge</h3>
            <p className="text-gray-300 text-sm">Chat with AI for personalized recommendations based on your location and preferences.</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <Settings size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Preferences</h3>
            <p className="text-gray-300 text-sm">Set dietary, vibe, budget, and time preferences to get tailored suggestions for your entire group.</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
              <Zap size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Basecamp Intelligence</h3>
            <p className="text-gray-300 text-sm">Get location-aware recommendations within walking distance or perfect travel time from your basecamp.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Contextual Chat</h3>
            <p className="text-gray-300 text-sm">Real-time assistance for planning activities, finding restaurants, and making the most of your trip.</p>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Free vs. Plus</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">Free Plan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Basic trip planning</li>
                <li>• Manual place discovery</li>
                <li>• Limited group features</li>
                <li>• Standard chat</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Plus</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li>• AI-powered recommendations</li>
                <li>• Smart preference matching</li>
                <li>• Basecamp-aware suggestions</li>
                <li>• Concierge AI chat</li>
                <li>• Personalized itinerary building</li>
                <li>• Group preference management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 backdrop-blur-sm border border-glass-orange/30 rounded-2xl p-6 mb-6">
            <div className="text-4xl font-bold text-white mb-2">${TRIPS_PLUS_PRICE}/month</div>
            <p className="text-gray-300 mb-4">7-day free trial • Cancel anytime</p>
            <div className="text-sm text-glass-yellow">
              No credit card required for trial
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-2xl transition-all duration-200 font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Start Free Trial'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};