
import React, { useState } from 'react';
import { Users, Shield, QrCode, Filter, UserCheck, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ProParticipant } from '../../types/pro';

interface RosterTabProps {
  roster: ProParticipant[];
  userRole: 'admin' | 'staff' | 'talent';
}

export const RosterTab = ({ roster, userRole }: RosterTabProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showCredentials, setShowCredentials] = useState(false);

  const roles = ['all', 'artist', 'manager', 'crew', 'security', 'player', 'coach', 'tour-mgr', 'guitar-tech'];
  
  const filteredRoster = selectedRole === 'all' 
    ? roster 
    : roster.filter(member => member.role === selectedRole);

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'all-areas': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'backstage': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'venue-only': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'restricted': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'artist':
      case 'player': return <Crown size={16} className="text-yellow-400" />;
      case 'manager':
      case 'coach': return <Shield size={16} className="text-blue-400" />;
      case 'security': return <Shield size={16} className="text-red-400" />;
      default: return <Users size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-red-400" />
          <div>
            <h2 className="text-xl font-semibold text-white">Team Roster & Roles</h2>
            <p className="text-gray-400 text-sm">Manage team members, roles, and access credentials</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCredentials(!showCredentials)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <QrCode size={16} className="mr-2" />
            {showCredentials ? 'Hide' : 'Show'} Credentials
          </Button>
        </div>
      </div>

      {/* Role Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <Button
            key={role}
            onClick={() => setSelectedRole(role)}
            variant={selectedRole === role ? "default" : "outline"}
            size="sm"
            className={`${
              selectedRole === role 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Filter size={14} className="mr-1" />
            {role === 'all' ? 'All Roles' : role.replace('-', ' ').toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoster.map((member) => (
          <Card key={member.id} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                  alt={member.name}
                  className="w-12 h-12 rounded-full border-2 border-red-500/30"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(member.role)}
                    <h3 className="font-semibold text-white">{member.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{member.role.replace('-', ' ')}</p>
                </div>
                {member.isActive ? (
                  <UserCheck size={16} className="text-green-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Access Level */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Access Level</p>
                <Badge className={`text-xs ${getAccessLevelColor(member.accessLevel)} border`}>
                  {member.accessLevel.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>

              {/* Room Assignment */}
              {member.roomAssignment && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Room Assignment</p>
                  <p className="text-sm text-white">{member.roomAssignment}</p>
                </div>
              )}

              {/* Credentials */}
              {showCredentials && member.credentials.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Credentials</p>
                  <div className="flex flex-wrap gap-1">
                    {member.credentials.map((credential, index) => (
                      <Badge key={index} className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {credential}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Medical Notes (Admin only) */}
              {userRole === 'admin' && member.medicalNotes && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Medical Notes</p>
                  <p className="text-sm text-yellow-300 bg-yellow-500/10 p-2 rounded">
                    {member.medicalNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Team Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{roster.length}</div>
              <div className="text-sm text-gray-400">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {roster.filter(m => m.isActive).length}
              </div>
              <div className="text-sm text-gray-400">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {roster.filter(m => m.accessLevel === 'all-areas').length}
              </div>
              <div className="text-sm text-gray-400">All-Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {roster.filter(m => m.roomAssignment).length}
              </div>
              <div className="text-sm text-gray-400">Rooms Assigned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
