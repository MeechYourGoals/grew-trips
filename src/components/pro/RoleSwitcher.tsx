
import React from 'react';
import { Users, Shield, Star, Play, Wrench, Lock, Heart, Camera } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';

const roles = [
  { id: 'admin', label: 'Admin', icon: Shield, color: 'bg-red-500' },
  { id: 'staff', label: 'Staff', icon: Users, color: 'bg-blue-500' },
  { id: 'talent', label: 'Talent', icon: Star, color: 'bg-yellow-500' },
  { id: 'player', label: 'Player', icon: Play, color: 'bg-green-500' },
  { id: 'crew', label: 'Crew', icon: Wrench, color: 'bg-gray-500' },
  { id: 'security', label: 'Security', icon: Lock, color: 'bg-purple-500' },
  { id: 'medical', label: 'Medical', icon: Heart, color: 'bg-pink-500' },
  { id: 'producer', label: 'Producer', icon: Camera, color: 'bg-indigo-500' }
];

export const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();

  if (!user?.isPro) return null;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-bold text-white mb-4">Role Testing</h3>
      <p className="text-gray-400 text-sm mb-4">
        Current role: <span className="text-white font-medium">{user.proRole}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Button
              key={role.id}
              onClick={() => switchRole(role.id)}
              variant={user.proRole === role.id ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 ${
                user.proRole === role.id 
                  ? `${role.color} text-white` 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Icon size={14} />
              {role.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
