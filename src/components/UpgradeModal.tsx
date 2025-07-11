import React, { useState } from 'react';
import { X, Crown, Building, Sparkles, MessageCircle, Settings, Zap, Users, Shield, TrendingUp, Star, BarChart3, Calendar, Wallet, Globe, Phone } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TRIPS_PLUS_PRICE } from '../types/consumer';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal = ({ isOpen, onClose }: UpgradeModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'plus' | 'pro'>('plus');
  const { upgradeToPlus, isLoading } = useConsumerSubscription();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (selectedPlan === 'plus') {
      await upgradeToPlus();
      onClose();
    } else {
      // Handle Pro upgrade - activate Pro features
      console.log('Upgrading to Pro...');
      // TODO: Implement Pro activation logic
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Choose Your Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Plan Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-2 flex">
            <button
              onClick={() => setSelectedPlan('plus')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                selectedPlan === 'plus'
                  ? 'bg-gradient-to-r from-glass-orange to-glass-yellow text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Crown size={18} />
              Trips Plus
            </button>
            <button
              onClick={() => setSelectedPlan('pro')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                selectedPlan === 'pro'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Building size={18} />
              Trips Pro
            </button>
          </div>
        </div>

        {/* Plan Content */}
        {selectedPlan === 'plus' ? (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Trips Plus</h3>
              <p className="text-gray-300">AI-powered travel planning for smarter trips</p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Triv Concierge</h4>
                <p className="text-gray-300 text-sm">Chat with AI for personalized recommendations based on your location and preferences.</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                  <Settings size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Smart Preferences</h4>
                <p className="text-gray-300 text-sm">Set dietary, vibe, budget, and time preferences to get tailored suggestions for your entire group.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                  <Zap size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Basecamp Intelligence</h4>
                <p className="text-gray-300 text-sm">Get location-aware recommendations within walking distance or perfect travel time from your basecamp.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Contextual Chat</h4>
                <p className="text-gray-300 text-sm">Real-time assistance for planning activities, finding restaurants, and making the most of your trip.</p>
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
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building size={32} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Trips Pro</h3>
              <p className="text-gray-300">Enterprise software for professional trip management</p>
            </div>

            {/* Pro Features - Full descriptions restored */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <Users size={24} className="text-yellow-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Advanced Team Collaboration</h4>
                <p className="text-gray-300 text-sm">Comprehensive team management with role-based permissions, collaborative planning tools, and real-time synchronization across all team members.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <Wallet size={24} className="text-yellow-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Enterprise Budget Management</h4>
                <p className="text-gray-300 text-sm">Comprehensive expense tracking, budget allocation, automated approval workflows, and detailed financial reporting with export capabilities.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 size={24} className="text-yellow-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Analytics & Business Intelligence</h4>
                <p className="text-gray-300 text-sm">Detailed trip analytics, sentiment analysis, performance metrics, ROI tracking, and customizable dashboards for data-driven decision making.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <Phone size={24} className="text-yellow-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">24/7 Priority Support</h4>
                <p className="text-gray-300 text-sm">Dedicated account management, priority technical support, custom integrations, and enterprise-grade SLA guarantees.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <Shield size={24} className="text-yellow-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Enterprise Security & Compliance</h4>
                <p className="text-gray-300 text-sm">Advanced security features, SSO integration, audit trails, GDPR compliance, and enterprise-grade data protection standards.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <Globe size={24} className="text-yellow-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Multi-Organization Management</h4>
                <p className="text-gray-300 text-sm">Manage multiple organizations, white-label options, custom branding, and scalable seat-based pricing for enterprise deployments.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-yellow-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Advanced Scheduling & Automation</h4>
                <p className="text-gray-300 text-sm">Automated itinerary generation, smart scheduling optimization, calendar integrations, and workflow automation for complex travel operations.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <Star size={24} className="text-yellow-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Custom Integrations & API Access</h4>
                <p className="text-gray-300 text-sm">REST API access, custom integrations with existing systems, webhook support, and developer resources for seamless enterprise integration.</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 mb-6">
                <div className="text-4xl font-bold text-white mb-2">Start Trial</div>
                <p className="text-gray-300 mb-2">Custom pricing available for large scale events, contact sales for more</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center">
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
  );
};
