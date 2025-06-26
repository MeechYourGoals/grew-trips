
import React, { useState } from 'react';
import { Building, Users, CreditCard, Shield, Settings, Bell, User, Crown, Wallet, Plane } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '../types/pro';
import { TravelWallet } from './TravelWallet';

interface EnterpriseSettingsProps {
  organizationId: string;
  currentUserId: string;
}

export const EnterpriseSettings = ({ organizationId, currentUserId }: EnterpriseSettingsProps) => {
  const [activeSection, setActiveSection] = useState('organization');

  // Mock organization data
  const organization = {
    id: organizationId,
    name: 'Acme Entertainment Group',
    displayName: 'Acme Entertainment',
    subscriptionTier: 'growing' as const,
    subscriptionStatus: 'active' as const,
    seatLimit: 25,
    seatsUsed: 18,
    billingEmail: 'billing@acme.com',
    subscriptionEndsAt: '2025-12-15',
    currentUserRole: 'owner'
  };

  const sections = [
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
    { id: 'seats', label: 'Seat Management', icon: Users },
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'travel-wallet', label: 'Travel Wallet', icon: Wallet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'settings', label: 'General Settings', icon: Settings }
  ];

  const renderOrganizationSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-xl flex items-center justify-center">
          <Building size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Organization Settings</h3>
          <p className="text-gray-400">Manage your organization profile and details</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Organization Details</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Organization Name</label>
            <input
              type="text"
              defaultValue={organization.name}
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              defaultValue={organization.displayName}
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Billing Email</label>
            <input
              type="email"
              defaultValue={organization.billingEmail}
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Organization ID</label>
            <input
              type="text"
              value={organization.id}
              disabled
              className="w-full bg-gray-700/50 border border-gray-600 text-gray-400 rounded-lg px-4 py-3"
            />
          </div>
        </div>
        <button className="mt-6 bg-glass-orange hover:bg-glass-orange/80 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Billing & Subscription</h3>
      
      {/* Current Plan */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Crown size={24} className="text-green-400" />
            <div>
              <h4 className="text-xl font-bold text-white">{SUBSCRIPTION_TIERS[organization.subscriptionTier].name}</h4>
              <p className="text-green-400">Active Subscription</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">${SUBSCRIPTION_TIERS[organization.subscriptionTier].price}/month</div>
            <div className="text-sm text-gray-400">Renews {organization.subscriptionEndsAt}</div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h5 className="font-semibold text-white mb-3">Current Plan Features</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              {SUBSCRIPTION_TIERS[organization.subscriptionTier].features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-3">Usage Statistics</h5>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Seats Used</span>
                  <span className="text-white">{organization.seatsUsed}/{organization.seatLimit}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full" 
                    style={{ width: `${(organization.seatsUsed / organization.seatLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {organization.seatLimit - organization.seatsUsed} seats available
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Manage Billing
          </button>
          <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Available Plans</h4>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
            <div
              key={key}
              className={`border rounded-lg p-4 ${
                key === organization.subscriptionTier
                  ? 'border-green-500/50 bg-green-500/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <h5 className="font-semibold text-white mb-2">{tier.name}</h5>
              <div className="text-xl font-bold text-white mb-1">${tier.price}/month</div>
              <div className="text-sm text-gray-400 mb-3">Up to {tier.seatLimit} seats</div>
              {key === organization.subscriptionTier && (
                <div className="text-sm text-green-400 font-medium">Current Plan</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSeatManagementSection = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Seat Management</h3>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-white">Team Members</h4>
          <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Invite Member
          </button>
        </div>
        
        {/* Seat Usage Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{organization.seatsUsed}</div>
            <div className="text-sm text-gray-400">Active Seats</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{organization.seatLimit - organization.seatsUsed}</div>
            <div className="text-sm text-gray-400">Available Seats</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{organization.seatLimit}</div>
            <div className="text-sm text-gray-400">Total Seats</div>
          </div>
        </div>

        {/* Mock Team Members */}
        <div className="space-y-3">
          {[
            { name: 'Sarah Johnson', email: 'sarah@acme.com', role: 'Admin', status: 'Active', joinedAt: '2024-01-15' },
            { name: 'Mike Chen', email: 'mike@acme.com', role: 'Member', status: 'Active', joinedAt: '2024-02-01' },
            { name: 'Lisa Rodriguez', email: 'lisa@acme.com', role: 'Member', status: 'Pending', joinedAt: '2024-02-15' }
          ].map((member, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{member.name}</div>
                  <div className="text-sm text-gray-400">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <div className="text-white">{member.role}</div>
                  <div className={`text-xs ${
                    member.status === 'Active' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {member.status}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Settings size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTravelWalletSection = () => (
    <div>
      <TravelWallet userId={currentUserId} />
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'organization': return renderOrganizationSection();
      case 'billing': return renderBillingSection();
      case 'seats': return renderSeatManagementSection();
      case 'travel-wallet': return renderTravelWalletSection();
      default: return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Section under development</div>
          <p className="text-sm text-gray-500">This feature will be available soon.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Enterprise Settings</h2>
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeSection === section.id
                    ? 'bg-glass-orange/20 text-glass-orange border border-glass-orange/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {renderSection()}
      </div>
    </div>
  );
};
