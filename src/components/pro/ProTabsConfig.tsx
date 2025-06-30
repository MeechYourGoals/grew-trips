
import React from 'react';
import { Crown, Users, Package, Calendar as CalendarIcon, DollarSign, Shield, Tv, Award, FileCheck } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface ProTab {
  id: string;
  label: string;
  icon: LucideIcon | null;
  proOnly?: boolean;
  restrictedRoles?: string[];
  requiredPermissions?: string[];
}

export const proTabs: ProTab[] = [
  { id: 'chat', label: 'Chat', icon: null },
  { id: 'places', label: 'Places', icon: null },
  { id: 'roster', label: 'Roster', icon: Users, proOnly: true, requiredPermissions: ['read'] },
  { id: 'equipment', label: 'Equipment', icon: Package, proOnly: true, requiredPermissions: ['read'] },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon, proOnly: true, requiredPermissions: ['read'] },
  { id: 'finance', label: 'Finance', icon: DollarSign, proOnly: true, restrictedRoles: ['talent', 'player'], requiredPermissions: ['finance'] },
  { id: 'medical', label: 'Medical', icon: Shield, proOnly: true, requiredPermissions: ['medical', 'admin'] },
  { id: 'compliance', label: 'Compliance', icon: FileCheck, proOnly: true, restrictedRoles: ['talent', 'player'], requiredPermissions: ['compliance', 'admin'] },
  { id: 'media', label: 'Media', icon: Tv, proOnly: true, requiredPermissions: ['read'] },
  { id: 'sponsors', label: 'Sponsors', icon: Award, proOnly: true, requiredPermissions: ['admin'] },
  { id: 'ai-chat', label: 'AI Assistant', icon: null },
  { id: 'search', label: 'Search', icon: null }
];

export const getVisibleTabs = (userRole: string, userPermissions: string[]): ProTab[] => {
  return proTabs.filter(tab => {
    // Check role-based restrictions
    if (tab.restrictedRoles && tab.restrictedRoles.includes(userRole)) {
      return false;
    }
    
    // Check permission requirements
    if (tab.requiredPermissions && tab.requiredPermissions.length > 0) {
      const hasRequiredPermission = tab.requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );
      if (!hasRequiredPermission) {
        return false;
      }
    }
    
    return true;
  });
};

export const isReadOnlyTab = (tabId: string, userRole: string, userPermissions: string[]): boolean => {
  // Finance and compliance tabs are read-only for talent/player roles
  if ((tabId === 'finance' || tabId === 'compliance') && (userRole === 'talent' || userRole === 'player')) {
    return true;
  }
  
  // Check if user has write permissions
  if (!userPermissions.includes('write') && !userPermissions.includes('admin')) {
    return true;
  }
  
  return false;
};

export const hasTabAccess = (tabId: string, userRole: string, userPermissions: string[]): boolean => {
  const tab = proTabs.find(t => t.id === tabId);
  if (!tab) return false;
  
  // Check role restrictions
  if (tab.restrictedRoles && tab.restrictedRoles.includes(userRole)) {
    return false;
  }
  
  // Check permission requirements
  if (tab.requiredPermissions && tab.requiredPermissions.length > 0) {
    return tab.requiredPermissions.some(permission => userPermissions.includes(permission));
  }
  
  return true;
};
