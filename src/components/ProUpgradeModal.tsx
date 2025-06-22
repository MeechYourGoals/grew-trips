
import React from 'react';
import { X, Crown, Mic, Users, Calendar, Shield } from 'lucide-react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProUpgradeModal = ({ isOpen, onClose }: ProUpgradeModalProps) => {
  if (!isOpen) return null;

  const proFeatures = [
    {
      icon: <Mic size={20} className="text-glass-orange" />,
      title: 'Tour Dashboard',
      description: 'Manage entire tours with multi-city overview'
    },
    {
      icon: <Users size={20} className="text-glass-yellow" />,
      title: 'Team Management',
      description: 'Role-based permissions and rotating team members'
    },
    {
      icon: <Calendar size={20} className="text-glass-green" />,
      title: 'Per-City Chats',
      description: 'Isolated group chats for each tour stop'
    },
    {
      icon: <Shield size={20} className="text-purple-400" />,
      title: 'Advanced Permissions',
      description: 'Manager-only notes and controlled access'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-2xl flex items-center justify-center">
              <Crown size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Upgrade to Trips Pro</h2>
              <p className="text-gray-400">Perfect for touring professionals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {proFeatures.map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">$99/month</div>
            <div className="text-gray-400 mb-4">Perfect for touring artists, comedians, musicians</div>
            <div className="text-sm text-glass-yellow">14-day free trial • Cancel anytime</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-3 rounded-2xl transition-all duration-200 font-medium"
          >
            Maybe Later
          </button>
          <button className="flex-1 bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white font-medium py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};
