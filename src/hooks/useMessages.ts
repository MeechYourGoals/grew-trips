
import { useState, useEffect } from 'react';
import { Message, ScheduledMessage } from '../types/messaging';
import { OpenAIService } from '../services/OpenAIService';
import { proTripMockData } from '../data/proTripMockData';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate dynamic mock messages based on trip data
  const generateMockMessages = (tourId: string): Message[] => {
    const tripData = proTripMockData[tourId];
    if (!tripData) return [];

    const participants = tripData.participants;
    const baseMessages: Message[] = [
      {
        id: '1',
        content: `Looking forward to ${tripData.title}! This is going to be amazing.`,
        senderId: 'user-1',
        senderName: participants[0]?.name || 'Team Lead',
        senderAvatar: participants[0]?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        timestamp: '2024-01-15T10:30:00Z',
        isRead: false,
        tourId: tourId
      },
      {
        id: '2',
        content: `Just confirmed all arrangements for ${tripData.location}. Everything looks great!`,
        senderId: 'user-2',
        senderName: participants[1]?.name || 'Coordinator',
        senderAvatar: participants[1]?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        timestamp: '2024-01-15T11:15:00Z',
        isRead: false,
        tourId: tourId
      },
      {
        id: '3',
        content: `Team check-in: Is everyone ready for ${tripData.dateRange}?`,
        senderId: 'user-3',
        senderName: participants[2]?.name || 'Manager',
        senderAvatar: participants[2]?.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        timestamp: '2024-01-15T14:22:00Z',
        isRead: false,
        tourId: tourId
      }
    ];

    return baseMessages;
  };

  const getMessagesForTour = (tourId: string): Message[] => {
    return generateMockMessages(tourId);
  };

  const getMessagesForTrip = (tripId: string): Message[] => {
    return messages.filter(msg => msg.tripId === tripId);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setScheduledMessages(prev => {
        const toSend = prev.filter(m => !m.isSent && new Date(m.sendAt) <= now);
        if (toSend.length > 0) {
          toSend.forEach(m => {
            setMessages(ms => [...ms, { ...m, isSent: undefined }]);
          });
        }
        return prev.map(m => (toSend.includes(m) ? { ...m, isSent: true } : m));
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const addMessage = async (content: string, tripId?: string, tourId?: string) => {
    const priority = await OpenAIService.classifyPriority(content);
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      timestamp: new Date().toISOString(),
      isRead: true,
      tripId,
      tourId,
      priority
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const scheduleMessage = async (content: string, sendAt: Date, tripId?: string, tourId?: string) => {
    const priority = await OpenAIService.classifyPriority(content);
    try {
      await fetch('/api/message-scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          send_at: sendAt.toISOString(),
          trip_id: tripId,
          user_id: 'current-user',
          priority
        })
      });
    } catch (err) {
      console.error('Failed to schedule message', err);
    }
  };

  const searchMessages = (query: string) => {
    setSearchQuery(query);
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const getTotalUnreadCount = (): number => {
    return messages.filter(msg => !msg.isRead).length;
  };

  const getTripUnreadCount = (tripId: string): number => {
    return messages.filter(msg => msg.tripId === tripId && !msg.isRead).length;
  };

  return {
    messages,
    scheduledMessages,
    searchQuery,
    getMessagesForTour,
    getMessagesForTrip,
    addMessage,
    scheduleMessage,
    searchMessages,
    markAsRead,
    getTotalUnreadCount,
    getTripUnreadCount
  };
};
