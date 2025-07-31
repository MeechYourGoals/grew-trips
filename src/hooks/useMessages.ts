import { useState } from 'react';
import { Channel, MessageResponse } from 'stream-chat';
import { useGetStream } from './useGetStream';
import { Message, ScheduledMessage } from '../types/messaging';
import { OpenAIService } from '../services/OpenAIService';

interface ChannelMap {
  [tripId: string]: Channel;
}

interface MessageMap {
  [tripId: string]: Message[];
}

const mapMessage = (msg: MessageResponse, tripId: string): Message => ({
  id: msg.id,
  content: msg.text || '',
  senderId: msg.user?.id || '',
  senderName: msg.user?.name || '',
  senderAvatar: msg.user?.image,
  timestamp: new Date(msg.created_at as string).toISOString(),
  isRead: true,
  tripId
});

export const useMessages = () => {
  const { isReady, getTripChannel } = useGetStream();
  const [channels, setChannels] = useState<ChannelMap>({});
  const [messagesByTrip, setMessagesByTrip] = useState<MessageMap>({});
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const ensureChannel = async (tripId: string): Promise<Channel | null> => {
    if (!isReady) return null;
    if (channels[tripId]) return channels[tripId];
    const channel = await getTripChannel(tripId);
    if (!channel) return null;
    await channel.watch();
    setChannels(prev => ({ ...prev, [tripId]: channel }));
    const initial = channel.state.messages.map(m => mapMessage(m as unknown as MessageResponse, tripId));
    setMessagesByTrip(prev => ({ ...prev, [tripId]: initial }));
    channel.on('message.new', event => {
      const msg = mapMessage(event.message as unknown as MessageResponse, tripId);
      setMessagesByTrip(prev => ({
        ...prev,
        [tripId]: [...(prev[tripId] || []), msg]
      }));
    });
    return channel;
  };

  const getMessagesForTrip = (tripId: string): Message[] => {
    ensureChannel(tripId);
    return messagesByTrip[tripId] || [];
  };

  const getMessagesForTour = (tourId: string): Message[] => getMessagesForTrip(tourId);

  const addMessage = async (content: string, tripId?: string, tourId?: string) => {
    const id = tripId || tourId;
    if (!id) return;
    const channel = await ensureChannel(id);
    if (!channel) return;
    await channel.sendMessage({ text: content });
  };

  const scheduleMessage = async (content: string, sendAt: Date, tripId?: string, tourId?: string) => {
    const priority = await OpenAIService.classifyPriority(content);
    try {
      await fetch('/api/message-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          send_at: sendAt.toISOString(),
          trip_id: tripId,
          tour_id: tourId,
          user_id: 'current-user',
          priority
        })
      });
    } catch (err) {
      console.error('Failed to schedule message', err);
    }
  };

  const searchMessages = (query: string) => setSearchQuery(query);

  const markAsRead = (messageId: string, tripId?: string) => {
    if (!tripId) return;
    setMessagesByTrip(prev => ({
      ...prev,
      [tripId]: (prev[tripId] || []).map(m =>
        m.id === messageId ? { ...m, isRead: true } : m
      )
    }));
  };

  const getTotalUnreadCount = (): number =>
    Object.values(messagesByTrip).flat().filter(m => !m.isRead).length;

  const getTripUnreadCount = (tripId: string): number =>
    (messagesByTrip[tripId] || []).filter(m => !m.isRead).length;

  return {
    messages: Object.values(messagesByTrip).flat(),
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
