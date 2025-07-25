
import { useState, useEffect } from 'react';
import { Message, ScheduledMessage } from '../types/messaging';
import { OpenAIService } from '../services/OpenAIService';
import { useGetStream } from './useGetStream';

export const useMessages = (tripId?: string) => {
  const { isReady, getTripChannel } = useGetStream();
  const [messages, setMessages] = useState<Message[]>([]);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelId, setChannelId] = useState<string | null>(null);
  const [channelObj, setChannelObj] = useState<any>(null);

  useEffect(() => {
    if (!tripId || !isReady) return;

    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      const channel = await getTripChannel(tripId);
      if (!channel) return;
      setChannelId(channel.id);
      setChannelObj(channel);

      const state = await channel.watch();
      const mapped = state.messages.map((m) => ({
        id: m.id,
        content: m.text || '',
        senderId: m.user?.id || '',
        senderName: m.user?.name || 'Unknown',
        senderAvatar: m.user?.image,
        timestamp: new Date(m.created_at).toISOString(),
        isRead: false,
        tripId
      }));
      setMessages(mapped);

      const handler = (event: any) => {
        const m = event.message;
        setMessages((prev) => [
          ...prev,
          {
            id: m.id,
            content: m.text || '',
            senderId: m.user?.id || '',
            senderName: m.user?.name || 'Unknown',
            senderAvatar: m.user?.image,
            timestamp: new Date(m.created_at).toISOString(),
            isRead: false,
            tripId
          }
        ]);
      };

      channel.on('message.new', handler);
      unsubscribe = () => channel.off('message.new', handler);
    };

    init();
    return () => {
      if (unsubscribe) unsubscribe();
      setChannelObj(null);
    };
  }, [tripId, isReady, getTripChannel]);

  const getMessagesForTour = (tour: string): Message[] => {
    return messages.filter((m) => m.tourId === tour);
  };

  const getMessagesForTrip = (_tripId: string): Message[] => {
    return messages.filter((m) => m.tripId === _tripId);
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

  const addMessage = async (content: string, tripIdParam?: string, tourId?: string) => {
    const priority = await OpenAIService.classifyPriority(content);

    if (channelObj) {
      await channelObj.sendMessage({ text: content });
    } else {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        senderId: 'current-user',
        senderName: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        timestamp: new Date().toISOString(),
        isRead: true,
        tripId: tripIdParam,
        tourId,
        priority
      };
      setMessages(prev => [...prev, newMessage]);
    }
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
