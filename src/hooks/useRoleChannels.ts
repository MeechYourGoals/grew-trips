import { useState, useEffect, useCallback } from 'react';
import { roleChannelService, RoleChannel, RoleChannelMessage } from '../services/roleChannelService';

export const useRoleChannels = (tripId: string, userRole: string) => {
  const [availableChannels, setAvailableChannels] = useState<RoleChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<RoleChannel | null>(null);
  const [messages, setMessages] = useState<RoleChannelMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load channels for this trip
  const loadChannels = useCallback(async () => {
    setIsLoading(true);
    const channels = await roleChannelService.getRoleChannels(tripId);
    
    // Filter to only show channels user can access
    const accessibleChannels = channels.filter(channel =>
      roleChannelService.canUserAccessChannel(channel, userRole)
    );
    
    setAvailableChannels(accessibleChannels);
    setIsLoading(false);
  }, [tripId, userRole]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  // Load messages when channel changes
  useEffect(() => {
    if (!activeChannel) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      const channelMessages = await roleChannelService.getChannelMessages(activeChannel.id);
      setMessages(channelMessages);
    };

    loadMessages();

    // Subscribe to new messages
    const unsubscribe = roleChannelService.subscribeToChannel(
      activeChannel.id,
      (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      }
    );

    return unsubscribe;
  }, [activeChannel]);

  const createChannel = async (roleName: string): Promise<boolean> => {
    const channel = await roleChannelService.createRoleChannel(tripId, roleName);
    if (channel) {
      await loadChannels();
      return true;
    }
    return false;
  };

  const deleteChannel = async (channelId: string): Promise<boolean> => {
    const success = await roleChannelService.deleteChannel(channelId);
    if (success) {
      if (activeChannel?.id === channelId) {
        setActiveChannel(null);
      }
      await loadChannels();
      return true;
    }
    return false;
  };

  const sendMessage = async (content: string): Promise<boolean> => {
    if (!activeChannel) return false;

    const message = await roleChannelService.sendChannelMessage(activeChannel.id, content);
    return !!message;
  };

  return {
    availableChannels,
    activeChannel,
    messages,
    isLoading,
    setActiveChannel,
    createChannel,
    deleteChannel,
    sendMessage,
    refreshChannels: loadChannels
  };
};

