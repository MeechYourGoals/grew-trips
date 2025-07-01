import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Phone, Mail, Shield, User } from 'lucide-react';
import { ProParticipant } from '../../types/pro-features';

interface RosterTabProps {
  roster: ProParticipant[];
  userRole: string;
  isReadOnly?: boolean;
}

export const RosterTab = ({ roster, userRole, isReadOnly = false }: RosterTabProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showCredentials, setShowCredentials] = useState(false);

  const roles = ['all', 'Player', 'Coach', 'TourManager', 'Crew', 'VIP', 'Security', 'Medical', 'Tech', 'Producer', 'Talent'];
  
  const filteredRoster = selectedRole === 'all' 
    ? roster 
    : roster.filter(member => member.role === selectedRole);

  const getCredentialColor = (level: string) => {
    switch (level) {
      case 'AllAccess': return 'bg-green-500';
      case 'Backstage': return 'bg-yellow-500';
      case 'Guest': return 'bg-blue-500';
      case 'Restricted': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Read-only notice */}
      {isReadOnly && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-yellow-400 text-sm">Read-only access for your role</p>
        </div>
      )}

      {/* Header with Stats */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="text-red-400" size={24} />
            <h2 className="text-xl font-bold text-white">Team Roster</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{roster.length} total members</span>
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Shield size={16} />
              {showCredentials ? 'Hide Credentials' : 'Show Credentials'}
            </button>
          </div>
        </div>

        {/* Role Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedRole === role
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {role === 'all' ? 'All Roles' : role}
              {role !== 'all' && (
                <span className="ml-1 text-xs">
                  ({roster.filter(m => m.role === role).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredRoster.map((member) => (
          <div key={member.id} className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <img
                src={member.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                alt={member.name}
                className="w-12 h-12 rounded-full border-2 border-gray-600"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{member.name}</h3>
                <p className="text-gray-400 text-sm">{member.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs font-medium">
                    {member.role}
                  </span>
                  {showCredentials && (
                    <span className={`${getCredentialColor(member.credentialLevel)} text-white px-2 py-1 rounded text-xs font-medium`}>
                      {member.credentialLevel}
                    </span>
                  )}
                </div>
              </div>
              {userRole === 'admin' && !isReadOnly && (
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Settings size={16} />
                </button>
              )}
            </div>

            {/* Medical Alerts */}
            {member.medicalNotes && (
              <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-yellow-400" />
                  <span className="text-yellow-400 text-xs font-medium">Medical Alert</span>
                </div>
              </div>
            )}

            {/* Dietary Restrictions */}
            {member.dietaryRestrictions && member.dietaryRestrictions.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-400 text-xs">Dietary: {member.dietaryRestrictions.join(', ')}</p>
              </div>
            )}

            {showCredentials && member.permissions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-gray-400 text-xs mb-1">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {member.permissions.map((permission, index) => (
                    <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRoster.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No team members found for the selected role.</p>
        </div>
      )}
    </div>
  );
};
