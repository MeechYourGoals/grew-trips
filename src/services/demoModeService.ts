import { supabase } from '@/integrations/supabase/client';
import { Channel } from 'stream-chat';

export interface MockMessage {
  id: string;
  trip_type: string;
  sender_name: string;
  message_content: string;
  delay_seconds: number;
  timestamp_offset_days: number;
  tags: string[];
}

export interface MockBroadcast {
  id: string;
  trip_type: string;
  sender_name: string;
  content: string;
  tag: 'chill' | 'logistics' | 'urgent';
  location?: string;
}

export class DemoModeService {
  private static instance: DemoModeService;
  private isDemoMode: boolean = false;

  private constructor() {
    // Check for demo mode from localStorage or environment
    this.isDemoMode = localStorage.getItem('TRIPS_DEMO_MODE') === 'true' || 
                      window.location.search.includes('demo=true');
  }

  static getInstance(): DemoModeService {
    if (!DemoModeService.instance) {
      DemoModeService.instance = new DemoModeService();
    }
    return DemoModeService.instance;
  }

  isDemoModeEnabled(): boolean {
    return this.isDemoMode;
  }

  enableDemoMode(): void {
    this.isDemoMode = true;
    localStorage.setItem('TRIPS_DEMO_MODE', 'true');
  }

  disableDemoMode(): void {
    this.isDemoMode = false;
    localStorage.removeItem('TRIPS_DEMO_MODE');
  }

  async getMockMessages(tripType: string): Promise<MockMessage[]> {
    if (!this.isDemoMode) return [];

    try {
      const { data, error } = await supabase
        .from('mock_messages')
        .select('*')
        .eq('trip_type', tripType)
        .order('timestamp_offset_days', { ascending: false });

      if (error) {
        console.error('Error fetching mock messages:', error);
        return this.getFallbackMessages(tripType);
      }

      if (!data || data.length === 0) {
        return this.getFallbackMessages(tripType);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMockMessages:', error);
      return this.getFallbackMessages(tripType);
    }
  }

  private getFallbackMessages(tripType: string): MockMessage[] {
    if (tripType === 'destination-wedding') {
      return [
        {
          id: 'wedding-1',
          trip_type: 'destination-wedding',
          sender_name: 'Emma',
          message_content: "can't wait for the photos to get dropped in here",
          delay_seconds: 0,
          timestamp_offset_days: 2,
          tags: ['excitement']
        },
        {
          id: 'wedding-2', 
          trip_type: 'destination-wedding',
          sender_name: 'Lisa',
          message_content: "so glad you broadcast that the reception moved back an hour, I was going to be late anyway lol",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['logistics']
        },
        {
          id: 'wedding-3',
          trip_type: 'destination-wedding', 
          sender_name: 'Mike',
          message_content: "shout out to cousin Steve, I have your tie from last night if you want to meet by the bar at 4pm. Don't have your number, otherwise would've text you direct.",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['coordination']
        }
      ];
    }
    
    return [];
  }

  async getMockBroadcasts(tripType: string): Promise<MockBroadcast[]> {
    if (!this.isDemoMode) return [];

    try {
      const { data, error } = await supabase
        .from('mock_broadcasts')
        .select('*')
        .eq('trip_type', tripType);

      if (error) {
        console.error('Error fetching mock broadcasts:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        tag: item.tag as 'chill' | 'logistics' | 'urgent'
      }));
    } catch (error) {
      console.error('Error in getMockBroadcasts:', error);
      return [];
    }
  }

  // Trip type mapping based on trip data
  getTripType(tripData: any): string {
    if (!tripData) return 'friends-trip';

    const title = tripData.title?.toLowerCase() || '';
    const category = tripData.category?.toLowerCase() || '';

    console.log('getTripType - Title:', title, 'Category:', category);

    // Professional trip types
    if (category.includes('pro') || tripData.isPro) {
      if (title.includes('lakers') || title.includes('sports')) return 'sports-pro';
      if (title.includes('taylor') || title.includes('tour')) return 'entertainment-tour';
      if (title.includes('eli lilly') || title.includes('corporate')) return 'corporate-retreat';
      if (title.includes('volleyball') || title.includes('youth')) return 'youth-sports';
      return 'sports-pro';
    }

    // Consumer trip types - Enhanced mapping
    if (title.includes('bachelorette') || title.includes('bachelor') || title.includes('kristen')) return 'bachelorette';
    if (title.includes('family') || title.includes('vacation') || title.includes('vacay') || title.includes('johnson')) return 'family-vacation';
    if (title.includes('coachella') || title.includes('festival') || title.includes('squad')) return 'festival';
    if (title.includes('wedding') || title.includes('jack and jill')) return 'destination-wedding';
    if (title.includes('bali') || title.includes('getaway') || title.includes('spring break') || title.includes('cancun') || title.includes('kappa alpha psi')) return 'leisure-group';
    if (title.includes('school') || title.includes('field trip') || title.includes('harris') || title.includes('8th grade') || title.includes('washington dc')) return 'school-trip';
    if (title.includes('golf') || title.includes('fantasy') || title.includes('outing') || title.includes('phoenix') || title.includes('commissioner')) return 'friends-trip';
    if (title.includes('tokyo') || title.includes('adventure') || title.includes('japan')) return 'leisure-group';

    return 'friends-trip';
  }

  async injectMockMessages(channel: Channel, tripType: string): Promise<void> {
    if (!this.isDemoMode) return;

    try {
      console.log('Injecting mock messages for trip type:', tripType);
      const mockMessages = await this.getMockMessages(tripType);
      console.log('Found mock messages:', mockMessages.length);
      
      if (mockMessages.length === 0) {
        console.warn('No mock messages found for trip type:', tripType);
        return;
      }
      
      for (const mock of mockMessages) {
        const messageId = `mock_${mock.id}_${Date.now()}_${Math.random()}`;
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - mock.timestamp_offset_days);
        createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 12));

        // Create mock message object that GetStream can render
        const mockMessage = {
          id: messageId,
          text: mock.message_content,
          user: {
            id: `mock_user_${mock.sender_name.replace(/\s+/g, '_').toLowerCase()}`,
            name: mock.sender_name,
            image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=40&h=40&fit=crop&crop=face`
          },
          created_at: createdAt.toISOString(),
          updated_at: createdAt.toISOString(),
          type: 'regular',
          __mock: true, // Hidden flag for demo detection
          isMock: true  // Visible flag for dev tools
        };

        console.log('Adding mock message:', mockMessage.text, 'from', mockMessage.user.name);
        
        // Add message to channel state without sending to server
        try {
          channel.state.addMessageSorted(mockMessage as any, true);
        } catch (streamError) {
          console.error('Error adding message to GetStream:', streamError);
        }
      }

      console.log('Mock messages injection completed. Channel message count:', channel.state.messages.length);

    } catch (error) {
      console.error('Error injecting mock messages:', error);
    }
  }

  // Generate realistic timestamps for demo
  private generateTimestamp(offsetDays: number): Date {
    const now = new Date();
    const timestamp = new Date(now.getTime() - (offsetDays * 24 * 60 * 60 * 1000));
    
    // Add some randomness to make it more realistic
    const randomHours = Math.floor(Math.random() * 12);
    const randomMinutes = Math.floor(Math.random() * 60);
    
    timestamp.setHours(timestamp.getHours() - randomHours);
    timestamp.setMinutes(randomMinutes);
    
    return timestamp;
  }
}

export const demoModeService = DemoModeService.getInstance();