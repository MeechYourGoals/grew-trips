import { getMockAvatar } from '@/utils/mockAvatars';

export interface MockMessage {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  created_at: string;
  isMock: boolean;
  reactions?: Record<string, { count: number; userReacted: boolean }>;
}

export const paulGeorgeMessages: MockMessage[] = [
  {
    id: 'pg-1',
    text: '🚌 Bus departs the Anaheim Hyatt at 6:45 AM sharp. Wear the navy PG Elite warm-ups so we roll in looking unified.',
    user: {
      id: 'coach_chris',
      name: 'Coach Chris',
      image: getMockAvatar('Coach Chris')
    },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isMock: true
  },
  {
    id: 'pg-2',
    text: '👕 Jersey check: Game 1 – white, Game 2 – navy. Pack both plus shooting shirts in your carry-on so nothing gets lost.',
    user: {
      id: 'team_manager_bria',
      name: 'Team Manager Bria',
      image: getMockAvatar('Team Manager Bria')
    },
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isMock: true
  },
  {
    id: 'pg-3',
    text: '🩺 Need ankles taped or ice packs? Swing by Room 409 between 6:15-6:35. Hydration packs will be in the hallway cooler outside PG\'s room.',
    user: {
      id: 'athletic_trainer_jalen',
      name: 'Athletic Trainer Jalen',
      image: getMockAvatar('Athletic Trainer Jalen')
    },
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isMock: true
  },
  {
    id: 'pg-4',
    text: '🍽️ Team dinner locked for 7:30 PM at BJ\'s Brewhouse (walkable). Any allergies or diet restrictions, DM me so I can give the host a heads-up.',
    user: {
      id: 'captain_rj_23',
      name: 'Captain RJ #23',
      image: getMockAvatar('Captain RJ #23')
    },
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isMock: true
  }
];