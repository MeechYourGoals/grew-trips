
import { useState, useEffect } from 'react';
import { Message, MessageThread, UnifiedInboxData } from '../types/messaging';

// Mock data for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey everyone! Just landed in Sydney. The venue looks amazing!',
    senderId: 'kevin',
    senderName: 'Kevin Hart',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    tripId: 'sydney-show',
    tourId: '1',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false
  },
  {
    id: '2',
    content: 'Sound check is at 4 PM. Please confirm attendance @everyone',
    senderId: 'manager',
    senderName: 'Tour Manager',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
    tripId: 'sydney-show',
    tourId: '1',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    mentions: ['everyone']
  },
  {
    id: '3',
    content: 'Merch booth is all set up! Looking good team 🔥',
    senderId: 'crew',
    senderName: 'Crew Chief',
    senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    tripId: 'melbourne-show',
    tourId: '1',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isRead: true
  },
  {
    id: '4',
    content: 'Tour update: Melbourne show sold out! 🎉',
    senderId: 'manager',
    senderName: 'Tour Manager',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
    tourId: '1',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isRead: false
  }
];

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');

  const addMessage = (content: string, tripId?: string, tourId?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: 'current-user',
      senderName: 'You',
      tripId,
      tourId,
      timestamp: new Date().toISOString(),
      isRead: true
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const searchMessages = (query: string) => {
    setSearchQuery(query);
  };

  const filteredMessages = messages.filter(msg => 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMessagesForTrip = (tripId: string) => {
    return messages.filter(msg => msg.tripId === tripId);
  };

  const getMessagesForTour = (tourId: string) => {
    return messages.filter(msg => msg.tourId === tourId && !msg.tripId);
  };

  const getTripUnreadCount = (tripId: string) => {
    return messages.filter(msg => msg.tripId === tripId && !msg.isRead).length;
  };

  const getTotalUnreadCount = () => {
    return messages.filter(msg => !msg.isRead).length;
  };

  return {
    messages: filteredMessages,
    addMessage,
    markAsRead,
    searchMessages,
    searchQuery,
    getMessagesForTrip,
    getMessagesForTour,
    getTripUnreadCount,
    getTotalUnreadCount
  };
};
