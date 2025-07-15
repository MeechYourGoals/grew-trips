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
    // Always show messages for pro trips, only check demo mode for consumer trips
    const isProTrip = ['sports-pro', 'entertainment-tour', 'corporate-retreat', 'youth-sports'].includes(tripType);
    if (!this.isDemoMode && !isProTrip) return [];

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
    // Enhanced consumer trip messages with more variety
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

    // Pro trip fallback messages
    if (tripType === 'sports-pro') {
      return [
        {
          id: 'sports-1',
          trip_type: 'sports-pro',
          sender_name: 'Coach Chris',
          message_content: "🚐 Bus departs the Anaheim Hyatt at 6:45 AM sharp. Wear the navy PG Elite warm-ups so we roll in looking unified.",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['logistics']
        },
        {
          id: 'sports-2',
          trip_type: 'sports-pro',
          sender_name: 'Team Manager Bria',
          message_content: "👕 Jersey check: Game 1 – white, Game 2 – navy. Pack both plus shooting shirts in your carry-on so nothing gets lost.",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['coordination']
        },
        {
          id: 'sports-3',
          trip_type: 'sports-pro',
          sender_name: 'Athletic Trainer Jalen',
          message_content: "⏰ Need ankles taped or ice packs? Swing by Room 409 between 6:15-6:35. Hydration packs will be in the hallway cooler outside PG's room.",
          delay_seconds: 0,
          timestamp_offset_days: 2,
          tags: ['medical']
        },
        {
          id: 'sports-4',
          trip_type: 'sports-pro',
          sender_name: 'Captain RJ #23',
          message_content: "🍽️ Team dinner locked for 7:30 PM at BJ's Brewhouse (walkable). Any allergies or diet restrictions, DM me so I can give the host a heads-up.",
          delay_seconds: 0,
          timestamp_offset_days: 2,
          tags: ['team']
        }
      ];
    }

    if (tripType === 'entertainment-tour') {
      return [
        {
          id: 'tour-1',
          trip_type: 'entertainment-tour',
          sender_name: 'Tour Director',
          message_content: "🎵 Load-in starts at 10 AM sharp — all crew report to loading dock",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['production']
        },
        {
          id: 'tour-2',
          trip_type: 'entertainment-tour',
          sender_name: 'Production Manager',
          message_content: "Sound check moved to 2:30 PM due to venue scheduling",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['logistics']
        },
        {
          id: 'tour-3',
          trip_type: 'entertainment-tour',
          sender_name: 'Security Chief',
          message_content: "Settlement meeting with venue at 11 PM post-show",
          delay_seconds: 0,
          timestamp_offset_days: 2,
          tags: ['business']
        }
      ];
    }

    if (tripType === 'corporate-retreat') {
      return [
        {
          id: 'corp-1',
          trip_type: 'corporate-retreat',
          sender_name: 'Event Coordinator',
          message_content: "📋 Updated agenda in the Files tab — review before tomorrow's session",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['business']
        },
        {
          id: 'corp-2',
          trip_type: 'corporate-retreat',
          sender_name: 'Executive Assistant',
          message_content: "Reminder: business casual attire for the client dinner tonight",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['coordination']
        },
        {
          id: 'corp-3',
          trip_type: 'corporate-retreat',
          sender_name: 'Team Lead',
          message_content: "Transportation to the golf course leaves at 8 AM from hotel lobby",
          delay_seconds: 0,
          timestamp_offset_days: 2,
          tags: ['logistics']
        }
      ];
    }

    if (tripType === 'youth-sports') {
      return [
        {
          id: 'youth-1',
          trip_type: 'youth-sports',
          sender_name: 'Coach Sarah',
          message_content: "🏐 Practice uniforms for warm-up, game jerseys for matches",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['youth']
        },
        {
          id: 'youth-2',
          trip_type: 'youth-sports',
          sender_name: 'Team Mom Lisa',
          message_content: "Parents: pick-up location has changed to the north parking lot",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['coordination']
        },
        {
          id: 'youth-3',
          trip_type: 'youth-sports',
          sender_name: 'Athletic Director',
          message_content: "Medical forms need to be submitted before tomorrow's games",
          delay_seconds: 0,
          timestamp_offset_days: 2,
          tags: ['compliance']
        }
      ];
    }

    // Add more consumer trip types
    if (tripType === 'leisure-group' || tripType === 'friends-trip') {
      return [
        {
          id: 'leisure-1',
          trip_type: 'leisure-group',
          sender_name: 'Marcus',
          message_content: "🏖️ Just checked the weather - perfect beach days ahead! Don't forget sunscreen.",
          delay_seconds: 0,
          timestamp_offset_days: 2,
          tags: ['preparation']
        },
        {
          id: 'leisure-2',
          trip_type: 'leisure-group',
          sender_name: 'Sarah',
          message_content: "Flight confirmation came through! Landing at 2:30 PM local time ✈️",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['logistics']
        },
        {
          id: 'leisure-3',
          trip_type: 'leisure-group',
          sender_name: 'Jamie',
          message_content: "Pool party starts at 4! I'll grab the floating unicorns 🦄",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['fun']
        }
      ];
    }

    if (tripType === 'bachelorette') {
      return [
        {
          id: 'bach-1',
          trip_type: 'bachelorette',
          sender_name: 'Ashley',
          message_content: "👰 Can't believe Kristen is getting married! Nashville here we come!",
          delay_seconds: 0,
          timestamp_offset_days: 3,
          tags: ['excitement']
        },
        {
          id: 'bach-2',
          trip_type: 'bachelorette',
          sender_name: 'Megan',
          message_content: "🎤 Booked us karaoke at 8 PM! Time to embarrass ourselves with 2000s hits",
          delay_seconds: 0,
          timestamp_offset_days: 2,
          tags: ['activities']
        },
        {
          id: 'bach-3',
          trip_type: 'bachelorette',
          sender_name: 'Taylor',
          message_content: "Hotel shuttle picks us up at 7:30 sharp. Don't be late ladies! 🚐",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['logistics']
        }
      ];
    }

    if (tripType === 'family-vacation') {
      return [
        {
          id: 'family-1',
          trip_type: 'family-vacation',
          sender_name: 'Dad (Mike)',
          message_content: "🏔️ Hiking trails look amazing! Everyone bring good walking shoes.",
          delay_seconds: 0,
          timestamp_offset_days: 3,
          tags: ['preparation']
        },
        {
          id: 'family-2',
          trip_type: 'family-vacation',
          sender_name: 'Mom (Linda)',
          message_content: "Spa appointments confirmed for Saturday afternoon. Can't wait to relax! 💆‍♀️",
          delay_seconds: 0,
          timestamp_offset_days: 2,
          tags: ['activities']
        },
        {
          id: 'family-3',
          trip_type: 'family-vacation',
          sender_name: 'Katie',
          message_content: "Tommy forgot his phone charger again 🙄 Good thing I packed extras!",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['family']
        }
      ];
    }

    if (tripType === 'festival') {
      return [
        {
          id: 'festival-1',
          trip_type: 'festival',
          sender_name: 'Tyler',
          message_content: "🎵 Lineup just dropped! We're gonna be at the main stage all weekend!",
          delay_seconds: 0,
          timestamp_offset_days: 3,
          tags: ['music']
        },
        {
          id: 'festival-2',
          trip_type: 'festival',
          sender_name: 'Zoe',
          message_content: "Camping gear is all packed! This is going to be epic 🏕️",
          delay_seconds: 0,
          timestamp_offset_days: 2,
          tags: ['preparation']
        },
        {
          id: 'festival-3',
          trip_type: 'festival',
          sender_name: 'Mason',
          message_content: "Found the perfect spot for our camp! Near the showers but not too close to the portapotties 😂",
          delay_seconds: 0,
          timestamp_offset_days: 1,
          tags: ['logistics']
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

    // Professional trip types with enhanced detection
    if (category.includes('pro') || tripData.isPro || category.includes('sports') || category.includes('entertainment')) {
      if (title.includes('lakers') || title.includes('basketball') || title.includes('sports') || title.includes('paul george') || title.includes('aau') || title.includes('nationals')) return 'sports-pro';
      if (title.includes('taylor') || title.includes('tour') || title.includes('eras') || title.includes('concert')) return 'entertainment-tour';
      if (title.includes('eli lilly') || title.includes('corporate') || title.includes('retreat') || title.includes('c-suite')) return 'corporate-retreat';
      if (title.includes('volleyball') || title.includes('youth') || title.includes('scarlet')) return 'youth-sports';
      if (title.includes('real housewives') || title.includes('shoot') || title.includes('production')) return 'entertainment-tour';
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