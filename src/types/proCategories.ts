
import { LucideIcon } from 'lucide-react';

export type ProTripCategory =
  | 'Sports & Athletics'
  | 'Music & Entertainment Tours'
  | 'Corporate & Business'
  | 'School'
  | 'Content'
  | 'Events';

export interface ProCategoryConfig {
  id: ProTripCategory;
  name: string;
  description: string;
  roles: string[];
  availableTabs: string[];
  requiredTabs: string[];
  terminology: {
    teamLabel: string;
    memberLabel: string;
    leaderLabel: string;
  };
}

export const PRO_CATEGORY_CONFIGS: Record<ProTripCategory, ProCategoryConfig> = {
  'Sports & Athletics': {
    id: 'Sports & Athletics',
    name: 'Sports & Athletics',
    description: 'Professional sports teams, tournaments, and athletic events',
    roles: ['Players', 'Coaches', 'Trainers', 'Medical Staff', 'Equipment Managers', 'PR/Marketing'],
    availableTabs: ['roster', 'equipment', 'calendar', 'medical', 'finance', 'compliance'],
    requiredTabs: ['roster', 'medical'],
    terminology: {
      teamLabel: 'Team Roster',
      memberLabel: 'Team Member',
      leaderLabel: 'Team Captain'
    }
  },
  'Music & Entertainment Tours': {
    id: 'Music & Entertainment Tours',
    name: 'Music & Entertainment Tours',
    description: 'Concert tours, residencies, and entertainment productions',
    roles: ['Artists', 'Tour Manager', 'Production Crew', 'Security', 'Drivers', 'Misc'],
    availableTabs: ['roster', 'equipment', 'calendar', 'finance', 'media', 'sponsors'],
    requiredTabs: ['roster', 'equipment'],
    terminology: {
      teamLabel: 'Tour Crew',
      memberLabel: 'Crew Member',
      leaderLabel: 'Tour Manager'
    }
  },
  'Corporate & Business': {
    id: 'Corporate & Business',
    name: 'Corporate & Business',
    description: 'Executive retreats, corporate events, and business travel',
    roles: ['Executives', 'Employees', 'Managers', 'Coordinators', 'Production'],
    availableTabs: ['roster', 'calendar', 'finance', 'compliance'],
    requiredTabs: ['roster'],
    terminology: {
      teamLabel: 'Attendees',
      memberLabel: 'Participant',
      leaderLabel: 'Event Lead'
    }
  },
  School: {
    id: 'School',
    name: 'School',
    description: 'School trips, academic competitions, and educational events',
    roles: ['Teachers', 'Students', 'Supervisors', 'Coordinators', 'Chaperones'],
    availableTabs: ['roster', 'calendar', 'compliance', 'medical'],
    requiredTabs: ['roster', 'compliance'],
    terminology: {
      teamLabel: 'Group',
      memberLabel: 'Participant',
      leaderLabel: 'Lead Teacher'
    }
  },
  Content: {
    id: 'Content',
    name: 'Content',
    description: 'Television shows, film productions, and media shoots',
    roles: ['Cast', 'Producers', 'Directors', 'Crew', 'Writing Team', 'Logistics Coordinators'],
    availableTabs: ['roster', 'equipment', 'calendar', 'media', 'sponsors', 'compliance'],
    requiredTabs: ['roster', 'equipment'],
    terminology: {
      teamLabel: 'Cast & Crew',
      memberLabel: 'Production Member',
      leaderLabel: 'Producer'
    }
  },
  Events: {
    id: 'Events',
    name: 'Events',
    description: 'Accelerator programs, tech conferences, and other events',
    roles: ['Speakers', 'Guests', 'Coordinators', 'Logistics', 'Press'],
    availableTabs: ['roster', 'calendar', 'finance'],
    requiredTabs: ['roster'],
    terminology: {
      teamLabel: 'Team',
      memberLabel: 'Team Member',
      leaderLabel: 'Event Lead'
    }
  }
};

export const getCategoryConfig = (category: ProTripCategory): ProCategoryConfig => {
  return PRO_CATEGORY_CONFIGS[category];
};

export const getAllCategories = (): ProTripCategory[] => {
  return Object.keys(PRO_CATEGORY_CONFIGS) as ProTripCategory[];
};
