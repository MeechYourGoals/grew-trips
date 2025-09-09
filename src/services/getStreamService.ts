import { StreamChat, Channel, User } from 'stream-chat';
import { supabase } from '@/integrations/supabase/client';
import { privacyService } from './privacyService';
import { PrivacyMode } from '../types/privacy';

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

  async getOrCreateTripChannel(tripId: string, privacyMode?: PrivacyMode): Promise<Channel> {
    if (!this.client) {
      throw new Error('GetStream client not initialized');
    }

    const channelId = `trip-${tripId}`;
    const channel = this.client.channel('messaging', channelId, {
      members: [], // Will be populated dynamically
      // Store privacy settings as custom data
      privacy_mode: privacyMode || 'standard',
      ai_access_enabled: privacyMode === 'standard',
    } as any);

    await channel.create();
    return channel;
  }

  // Send message with privacy-aware encryption
  async sendMessage(channel: Channel, content: string, privacyMode: PrivacyMode = 'standard'): Promise<void> {
    const tripId = channel.id?.replace('trip-', '') || '';
    
    const { content: processedContent, encrypted } = await privacyService.prepareMessageForSending(
      content,
      tripId,
      privacyMode
    );

    await channel.sendMessage({
      text: processedContent,
      // Store privacy metadata as custom data
      privacy_encrypted: encrypted,
      privacy_mode: privacyMode,
    } as any);
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