
import React from 'react';
import { Crown, Building } from 'lucide-react';

interface SubscriptionSectionProps {
  userOrganization?: {
    id: string;
    name: string;
    role: string;
    hasProAccess: boolean;
  };
  onShowProModal: () => void;
  onShowEnterpriseSettings: () => void;
}

export const SubscriptionSection = ({ 
  userOrganization, 
  onShowProModal, 
  onShowEnterpriseSettings 
}: SubscriptionSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Subscription</h3>
        {userOrganization?.hasProAccess && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 px-3 py-1 rounded-full">
            <Crown size={14} className="text-glass-orange" />
            <span className="text-glass-orange text-sm font-medium">ENTERPRISE</span>
          </div>
        )}
      </div>

      {userOrganization?.hasProAccess ? (
        <div className="bg-gradient-to-r from-glass-orange/10 to-glass-yellow/10 border border-glass-orange/20 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-2">Enterprise Access Active</h4>
          <p className="text-gray-300 text-sm mb-4">
            You have access to all Enterprise features through {userOrganization.name}
          </p>
          <div className="text-sm text-gray-400 mb-4">
            Role: <span className="text-glass-orange capitalize">{userOrganization.role}</span>
          </div>
          <button
            onClick={onShowEnterpriseSettings}
            className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Manage Organization
          </button>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-2">Individual Plan</h4>
          <p className="text-gray-300 text-sm mb-4">Perfect for personal trips and small groups</p>
          <button
            onClick={onShowProModal}
            className="w-full bg-gradient-to-r from-glass-orange to-glass-yellow text-white font-medium py-3 rounded-xl hover:scale-105 transition-transform"
          >
            Upgrade to Enterprise
          </button>
        </div>
      )}
    </div>
  );
};
