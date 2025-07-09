import { MockMessage } from './mockMessages';

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const createUserMessage = (text: string, userAvatar: string): MockMessage => ({
  id: `user_${Date.now()}`,
  text,
  user: {
    id: 'current_user',
    name: 'You',
    image: userAvatar
  },
  created_at: new Date().toISOString(),
  isMock: false
});

export const isPaulGeorgeTrip = (tripId: string): boolean => {
  return tripId.toLowerCase().includes('paul-george') || tripId.toLowerCase().includes('paul george');
};