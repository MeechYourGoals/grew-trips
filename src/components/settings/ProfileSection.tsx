
import React from 'react';
import { User, Mail, Phone, Building } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ProfileSectionProps {
  userOrganization?: {
    name: string;
  };
}

export const ProfileSection = ({ userOrganization }: ProfileSectionProps) => {
  const { user, updateProfile } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full" />
          ) : (
            <User size={32} className="text-white" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{user.displayName}</h3>
        <p className="text-gray-400 text-sm">{user.email || user.phone}</p>
        {userOrganization && (
          <div className="mt-2">
            <div className="inline-flex items-center gap-2 bg-glass-orange/20 px-3 py-1 rounded-full">
              <Building size={14} className="text-glass-orange" />
              <span className="text-glass-orange text-sm font-medium">{userOrganization.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Display Name</label>
          <input
            type="text"
            value={user.displayName}
            onChange={(e) => updateProfile({ displayName: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-glass-orange"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Contact Method</label>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            {user.email ? <Mail size={16} className="text-gray-400" /> : <Phone size={16} className="text-gray-400" />}
            <span className="text-white">{user.email || user.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
