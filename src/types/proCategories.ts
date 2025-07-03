
import { LucideIcon } from 'lucide-react';

export type ProTripCategory =
  | 'Sports & Athletics'
  | 'Music & Entertainment Tours'
  | 'Corporate & Business'
  | 'School'
  | 'TV/Film Production'
  | 'Startup & Tech';

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
    roles: ['Player', 'Coach', 'Athletic Trainer', 'Team Manager', 'Medical Staff', 'Equipment Manager'],
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
    roles: ['Artist', 'Tour Manager', 'Production Manager', 'Security Chief', 'Crew', 'Sound Engineer', 'Lighting Tech'],
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
    roles: ['Executive', 'Manager', 'Coordinator', 'Assistant', 'Facilitator'],
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
    roles: ['Teacher', 'Student', 'Supervisor', 'Coordinator', 'Chaperone'],
    availableTabs: ['roster', 'calendar', 'compliance', 'medical'],
    requiredTabs: ['roster', 'compliance'],
    terminology: {
      teamLabel: 'Group',
      memberLabel: 'Participant',
      leaderLabel: 'Lead Teacher'
    }
  },
  'TV/Film Production': {
    id: 'TV/Film Production',
    name: 'TV/Film Production',
    description: 'Television shows, film productions, and media shoots',
    roles: ['Cast', 'Producer', 'Director', 'Crew', 'Script Supervisor', 'Camera Operator'],
    availableTabs: ['roster', 'equipment', 'calendar', 'media', 'sponsors', 'compliance'],
    requiredTabs: ['roster', 'equipment'],
    terminology: {
      teamLabel: 'Cast & Crew',
      memberLabel: 'Production Member',
      leaderLabel: 'Producer'
    }
  },
  'Startup & Tech': {
    id: 'Startup & Tech',
    name: 'Startup & Tech',
    description: 'Accelerator programs, tech conferences, and startup events',
    roles: ['Founder', 'Mentor', 'Coordinator', 'Investor', 'Advisor'],
    availableTabs: ['roster', 'calendar', 'finance'],
    requiredTabs: ['roster'],
    terminology: {
      teamLabel: 'Team',
      memberLabel: 'Team Member',
      leaderLabel: 'Founder'
    }
  }
};

export const getCategoryConfig = (category: ProTripCategory): ProCategoryConfig => {
  return PRO_CATEGORY_CONFIGS[category];
};

export const getAllCategories = (): ProTripCategory[] => {
  return Object.keys(PRO_CATEGORY_CONFIGS) as ProTripCategory[];
};
