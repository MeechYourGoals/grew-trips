
import React, { useEffect } from 'react';
import {
  Users,
  Shield,
  Star,
  Play,
  Wrench,
  Lock,
  Heart,
  Camera,
  Crown,
  Building,
  GraduationCap,
  Mic,
  User,
  Truck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { ProTripCategory, getCategoryConfig } from '../../types/proCategories';

const getRoleIcon = (role: string, category: ProTripCategory) => {
  const lowerRole = role.toLowerCase();
  
  switch (category) {
    case 'Sports & Athletics':
      if (lowerRole.includes('player')) return Play;
      if (lowerRole.includes('coach')) return Users;
      if (lowerRole.includes('medical') || lowerRole.includes('trainer')) return Heart;
      return Shield;
    
    case 'Music & Entertainment Tours':
      if (lowerRole.includes('artist')) return Star;
      if (lowerRole.includes('manager')) return Users;
      if (lowerRole.includes('security')) return Lock;
      if (lowerRole.includes('sound') || lowerRole.includes('production')) return Wrench;
      return Camera;
    
    case 'Corporate & Business':
      if (lowerRole.includes('executive')) return Crown;
      if (lowerRole.includes('manager')) return Users;
      return Building;
    
    case 'School':
      if (lowerRole.includes('teacher') || lowerRole.includes('supervisor')) return GraduationCap;
      if (lowerRole.includes('student')) return Users;
      return Shield;
    
    case 'Content':
      if (lowerRole.includes('cast') || lowerRole.includes('talent')) return Star;
      if (lowerRole.includes('producer') || lowerRole.includes('director')) return Camera;
      return Wrench;

    case 'Events':
      if (lowerRole.includes('speaker')) return Mic;
      if (lowerRole.includes('guest')) return User;
      if (lowerRole.includes('logistics')) return Truck;
      if (lowerRole.includes('press')) return Camera;
      return Users;
    
    default:
      return Users;
  }
};

const getRoleColor = (role: string, category: ProTripCategory) => {
  const lowerRole = role.toLowerCase();
  
  switch (category) {
    case 'Sports & Athletics':
      if (lowerRole.includes('player')) return 'bg-green-500';
      if (lowerRole.includes('coach')) return 'bg-blue-500';
      if (lowerRole.includes('medical')) return 'bg-pink-500';
      return 'bg-gray-500';
    
    case 'Music & Entertainment Tours':
      if (lowerRole.includes('artist')) return 'bg-yellow-500';
      if (lowerRole.includes('manager')) return 'bg-blue-500';
      if (lowerRole.includes('security')) return 'bg-purple-500';
      return 'bg-gray-500';
    
    case 'Corporate & Business':
      if (lowerRole.includes('executive')) return 'bg-red-500';
      return 'bg-blue-500';
    
    case 'School':
      if (lowerRole.includes('teacher')) return 'bg-blue-500';
      if (lowerRole.includes('student')) return 'bg-green-500';
      return 'bg-gray-500';
    
    case 'Content':
      if (lowerRole.includes('cast')) return 'bg-yellow-500';
      if (lowerRole.includes('producer')) return 'bg-red-500';
      return 'bg-gray-500';

    case 'Events':
      if (lowerRole.includes('speaker')) return 'bg-yellow-500';
      if (lowerRole.includes('guest')) return 'bg-green-500';
      if (lowerRole.includes('logistics')) return 'bg-blue-500';
      if (lowerRole.includes('press')) return 'bg-red-500';
      return 'bg-gray-500';
    
    default:
      return 'bg-gray-500';
  }
};

interface RoleSwitcherProps {
  category: ProTripCategory;
}

export const RoleSwitcher = ({ category }: RoleSwitcherProps) => {
  const { user, switchRole } = useAuth();
  const config = getCategoryConfig(category);

  useEffect(() => {
    if (!user?.isPro || !user.proRole) return;
    const lowerRoles = config.roles.map((r) => r.toLowerCase());
    if (!lowerRoles.includes(user.proRole)) {
      switchRole(lowerRoles[0]);
    }
  }, [category]);

  if (!user?.isPro) return null;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-bold text-white mb-2">Roles - {config.name}</h3>
      <p className="text-gray-400 text-sm mb-4">
        Current role: <span className="text-white font-medium">{user.proRole}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {config.roles.map((role) => {
          const Icon = getRoleIcon(role, category);
          const colorClass = getRoleColor(role, category);
          return (
            <Button
              key={role}
              onClick={() => switchRole(role.toLowerCase())}
              variant={user.proRole === role.toLowerCase() ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 ${
                user.proRole === role.toLowerCase() 
                  ? `${colorClass} text-white` 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Icon size={14} />
              {role}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
