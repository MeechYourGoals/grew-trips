
import React from 'react';
import { Crown, Users, Package, Calendar as CalendarIcon, DollarSign, Shield, Tv, Award, FileCheck } from 'lucide-react';

export interface ProTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }> | null;
  proOnly?: boolean;
  restrictedRoles?: string[];
}

export const proTabs: ProTab[] = [
  { id: 'chat', label: 'Chat', icon: null },
  { id: 'places', label: 'Places', icon: null },
  { id: 'roster', label: 'Roster', icon: Users, proOnly: true },
  { id: 'equipment', label: 'Equipment', icon: Package, proOnly: true },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon, proOnly: true },
  { id: 'finance', label: 'Finance', icon: DollarSign, proOnly: true, restrictedRoles: ['talent', 'player'] },
  { id: 'medical', label: 'Medical', icon: Shield, proOnly: true },
  { id: 'compliance', label: 'Compliance', icon: FileCheck, proOnly: true, restrictedRoles: ['talent', 'player'] },
  { id: 'media', label: 'Media', icon: Tv, proOnly: true },
  { id: 'sponsors', label: 'Sponsors', icon: Award, proOnly: true },
  { id: 'ai-chat', label: 'AI Assistant', icon: null },
  { id: 'search', label: 'Search', icon: null }
];

export const getVisibleTabs = (userRole: string): ProTab[] => {
  return proTabs.filter(tab => {
    // Check role-based restrictions
    if (tab.restrictedRoles && tab.restrictedRoles.includes(userRole)) {
      return false; // Hide tabs that are restricted for this role
    }
    return true;
  });
};

export const isReadOnlyTab = (tabId: string, userRole: string): boolean => {
  // Only finance and compliance tabs have read-only access for talent/player roles
  if ((tabId === 'finance' || tabId === 'compliance') && (userRole === 'talent' || userRole === 'player')) {
    return true;
  }
  return false;
};
