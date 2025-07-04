import { StreamChat, Channel, User } from 'stream-chat';
import { supabase } from '@/integrations/supabase/client';

export class GetStreamService {
  private static instance: GetStreamService;
  private client: StreamChat | null = null;
  private currentUser: User | null = null;

  private constructor() {}

  static getInstance(): GetStreamService {
    if (!GetStreamService.instance) {
      GetStreamService.instance = new GetStreamService();
    }
    return GetStreamService.instance;
  }

  async initialize(userId: string, userName: string, userAvatar?: string): Promise<StreamChat> {
    if (this.client && this.currentUser?.id === userId) {
      return this.client;
    }

    try {
      // Get GetStream token from Supabase function
      const { data, error } = await supabase.functions.invoke('getstream-token', {
        body: {
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
        }
      });

      if (error || !data.token) {
        throw new Error('Failed to get GetStream token');
      }

      // Initialize GetStream client
      this.client = StreamChat.getInstance(data.api_key);
      
      // Connect user
      await this.client.connectUser(
        {
          id: userId,
          name: userName,
          image: userAvatar,
        },
        data.token
      );

      this.currentUser = { id: userId, name: userName, image: userAvatar };
      
      return this.client;
    } catch (error) {
      console.error('Error initializing GetStream:', error);
      throw error;
    }
  }

  async getOrCreateTripChannel(tripId: string): Promise<Channel> {
    if (!this.client) {
      throw new Error('GetStream client not initialized');
    }

    const channelId = `trip-${tripId}`;
    const channel = this.client.channel('messaging', channelId, {
      members: [], // Will be populated dynamically
    });

    await channel.create();
    return channel;
  }

  async disconnectUser(): Promise<void> {
    if (this.client) {
      await this.client.disconnectUser();
      this.client = null;
      this.currentUser = null;
    }
  }

  getClient(): StreamChat | null {
    return this.client;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const getStreamService = GetStreamService.getInstance();