
import { useState } from 'react';
import { Message } from '../types/messaging';
import { proTripMockData } from '../data/proTripMockData';

export const useMessages = () => {
  // Generate dynamic mock messages based on trip data
  const generateMockMessages = (tourId: string): Message[] => {
    const tripData = proTripMockData[tourId];
    if (!tripData) return [];

    const participants = tripData.participants;
    const baseMessages: Message[] = [
      {
        id: '1',
        content: `Looking forward to ${tripData.title}! This is going to be amazing.`,
        senderName: participants[0]?.name || 'Team Lead',
        senderAvatar: participants[0]?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        timestamp: '2024-01-15T10:30:00Z',
        tourId: tourId
      },
      {
        id: '2',
        content: `Just confirmed all arrangements for ${tripData.location}. Everything looks great!`,
        senderName: participants[1]?.name || 'Coordinator',
        senderAvatar: participants[1]?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        timestamp: '2024-01-15T11:15:00Z',
        tourId: tourId
      },
      {
        id: '3',
        content: `Team check-in: Is everyone ready for ${tripData.dateRange}?`,
        senderName: participants[2]?.name || 'Manager',
        senderAvatar: participants[2]?.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        timestamp: '2024-01-15T14:22:00Z',
        tourId: tourId
      }
    ];

    return baseMessages;
  };

  const [messages, setMessages] = useState<Message[]>([]);

  const getMessagesForTour = (tourId: string): Message[] => {
    return generateMockMessages(tourId);
  };

  const getMessagesForTrip = (tripId: string): Message[] => {
    return messages.filter(msg => msg.tripId === tripId);
  };

  const addMessage = (content: string, tripId?: string, tourId?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      timestamp: new Date().toISOString(),
      tripId,
      tourId
    };

    setMessages(prev => [...prev, newMessage]);
  };

  return {
    getMessagesForTour,
    getMessagesForTrip,
    addMessage
  };
};
