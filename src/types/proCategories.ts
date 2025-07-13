
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
    roles: ['Player', 'Coach', 'Crew', 'VIP', 'Security', 'Medical', 'Tech'],
    availableTabs: ['team', 'calendar', 'medical', 'finance', 'compliance'],
    requiredTabs: ['team', 'medical'],
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
    roles: ['Artist Team', 'Tour Manager', 'Crew', 'VIP', 'Security'],
    availableTabs: ['team', 'calendar', 'finance', 'media', 'sponsors'],
    requiredTabs: ['team'],
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
    roles: [],
    availableTabs: ['team', 'calendar', 'finance', 'compliance'],
    requiredTabs: ['team'],
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
    roles: ['Student', 'Chaperone', 'Teacher'],
    availableTabs: ['team', 'calendar', 'compliance', 'medical'],
    requiredTabs: ['team', 'compliance'],
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
    roles: ['Talent', 'Crew', 'Security'],
    availableTabs: ['team', 'calendar', 'media', 'sponsors', 'compliance'],
    requiredTabs: ['team'],
    terminology: {
      teamLabel: 'Cast & Crew',
      memberLabel: 'Production Member',
      leaderLabel: 'Producer'
    }
  },
  Events: {
    id: 'Events',
    name: 'Events',
    description: 'Professional conferences, trade shows, and other industry events',
    roles: ['Organizer', 'Speaker', 'Exhibitor', 'Attendee', 'VIP'],
    availableTabs: ['team', 'calendar', 'finance'],
    requiredTabs: ['team'],
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
