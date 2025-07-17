import React, { useState } from 'react';
import { X, Crown, Building, Sparkles, MessageCircle, Settings, Zap, Users, Shield, TrendingUp, Star, BarChart3, Calendar, Wallet, Globe, Phone, CalendarPlus, UserCheck, Clock, FileText, DollarSign, TrendingDown, Mail, Ticket, Megaphone, Paintbrush } from 'lucide-react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { TRIPS_PLUS_PRICE } from '../types/consumer';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal = ({ isOpen, onClose }: UpgradeModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'plus' | 'pro' | 'events'>('plus');
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
              className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
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
              className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                selectedPlan === 'pro'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Building size={18} />
              Trips Pro
            </button>
            <button
              onClick={() => setSelectedPlan('events')}
              className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                selectedPlan === 'events'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <CalendarPlus size={18} />
              Events
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
                <h4 className="text-lg font-bold text-white mb-2">Concierge</h4>
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
        ) : selectedPlan === 'pro' ? (
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
        ) : (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarPlus size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Junto Events</h3>
              <p className="text-gray-300 mb-4">Junto Events brings all your event management needs into one professional suite—connecting venues, schedules, attendees, and teams with real-time updates, collaboration, budgeting, and bulletproof communications. Streamline every step, from invitations to analytics, with robust security and branding for your ambitions.</p>
            </div>

            {/* Events Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <CalendarPlus size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">All-in-One Event Planning</h4>
                <p className="text-gray-300 text-sm">Manage attendee lists, schedules, venue details, and event essentials in one unified platform.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Mail size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Automated Invitations & RSVP</h4>
                <p className="text-gray-300 text-sm">Send invitations individually or in bulk via email/SMS, track status, and manage re-invitations.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <UserCheck size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Custom Roles & Permissions</h4>
                <p className="text-gray-300 text-sm">Assign roles to event staff (planner, vendor, performer, guest) with tiered access controls.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Clock size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Integrated Scheduling & Timeline</h4>
                <p className="text-gray-300 text-sm">Build multi-day agendas, time slots for activities, automated reminders, and conflict detection.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <FileText size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Real-time Collaboration</h4>
                <p className="text-gray-300 text-sm">Shared event chat, document sharing, and real-time updates for attendees, organizers, and vendors.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Budgeting & Payments</h4>
                <p className="text-gray-300 text-sm">Expense tracking, vendor payment management, split payments for group buys, and automated budget alerts.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Analytics & Insights</h4>
                <p className="text-gray-300 text-sm">Track ticket sales, RSVP-to-attendance rate, engagement metrics, and marketing performance.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Ticket size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Professional Invitations & Ticketing</h4>
                <p className="text-gray-300 text-sm">Generate custom invitations, integrate with ticketing platforms, and QR code ticket management.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 relative">
                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs px-2 py-1 rounded-full font-bold">
                  PREMIUM
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Megaphone size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Advanced Communication</h4>
                <p className="text-gray-300 text-sm">Broadcast urgent updates to all participants and schedule broadcast messages for pre-event, in-event, and post-event.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 relative">
                <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  PRO
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Paintbrush size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">White-label & Branding</h4>
                <p className="text-gray-300 text-sm">Brand the event experience with your logo, theme colors, and sponsor branding for large-scale clients.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Shield size={24} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Security & Compliance</h4>
                <p className="text-gray-300 text-sm">GDPR compliance, audit logging, secure file uploads, and granular invitation control to protect private events.</p>
              </div>
            </div>

            {/* Events Pricing Tiers */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4">
                <h5 className="font-bold text-white mb-2">Events Free</h5>
                <div className="text-2xl font-bold text-white mb-2">$0</div>
                <p className="text-gray-300 text-sm mb-3">Basic events, limited attendees</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Up to 50 attendees</li>
                  <li>• Core scheduling</li>
                  <li>• Basic invitations</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-4">
                <h5 className="font-bold text-white mb-2">Events Plus</h5>
                <div className="text-2xl font-bold text-white mb-2">$29/mo</div>
                <p className="text-gray-300 text-sm mb-3">Per organizer</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Unlimited events</li>
                  <li>• Full RSVP management</li>
                  <li>• Analytics & reporting</li>
                  <li>• Priority support</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4">
                <h5 className="font-bold text-white mb-2">Events Pro</h5>
                <div className="text-2xl font-bold text-white mb-2">$199/mo</div>
                <p className="text-gray-300 text-sm mb-3">Per organization</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• White-label branding</li>
                  <li>• Advanced reporting</li>
                  <li>• Mass upload features</li>
                  <li>• API access</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-700/20 to-gray-800/20 border border-gray-500/30 rounded-xl p-4">
                <h5 className="font-bold text-white mb-2">Enterprise</h5>
                <div className="text-2xl font-bold text-white mb-2">Custom</div>
                <p className="text-gray-300 text-sm mb-3">500+ attendees</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Dedicated support</li>
                  <li>• Custom SLAs</li>
                  <li>• Advanced compliance</li>
                  <li>• Custom integrations</li>
                </ul>
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
