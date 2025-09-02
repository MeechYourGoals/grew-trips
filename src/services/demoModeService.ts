
import { secureStorageService } from './secureStorageService';

interface MockMessage {
  id: string;
  trip_type?: string;
  sender_name: string;
  message_content: string;
  delay_seconds?: number;
  timestamp_offset_days?: number;
  tags?: string[];
}

export type { MockMessage };

interface MockBroadcast {
  id: string;
  trip_type?: string;
  sender_name: string;
  content: string;
  location?: string;
  tag: 'chill' | 'logistics' | 'urgent' | 'emergency';
  timestamp_offset_hours?: number;
}

class DemoModeService {
  getTripType(trip: any): string {
    if (!trip) return 'demo';
    if (trip.category === 'pro') return 'pro-trip';
    return 'consumer-trip';
  }

  async isDemoModeEnabled(userId?: string): Promise<boolean> {
    return await secureStorageService.isDemoModeEnabled(userId);
  }

  async enableDemoMode(userId?: string): Promise<void> {
    await secureStorageService.setDemoMode(true, userId);
  }

  async disableDemoMode(userId?: string): Promise<void> {
    await secureStorageService.setDemoMode(false, userId);
  }

  async getMockMessages(tripType: string): Promise<MockMessage[]> {
    // Enhanced mock messages with diverse, realistic names and proper message types
    const baseMessages: MockMessage[] = [
      // Regular conversation messages
      {
        id: 'msg_1',
        trip_type: tripType,
        sender_name: 'Sarah Chen',
        message_content: 'Super excited for this trip! Has everyone seen the weather forecast?',
        timestamp_offset_days: 2,
        tags: ['conversation']
      },
      {
        id: 'msg_2',
        trip_type: tripType,
        sender_name: 'Marcus Johnson',
        message_content: 'Just booked my flight! Landing at 3:30 PM on Friday 🛬',
        timestamp_offset_days: 2,
        tags: ['travel', 'logistics']
      },
      {
        id: 'msg_3',
        trip_type: tripType,
        sender_name: 'Priya Patel',
        message_content: 'Found an amazing restaurant for dinner - sending the link now!',
        timestamp_offset_days: 1,
        tags: ['restaurants', 'planning']
      },
      
      // Broadcast messages
      {
        id: 'msg_4',
        trip_type: tripType,
        sender_name: 'Emma Rodriguez',
        message_content: 'Meeting at hotel lobby at 9 AM sharp tomorrow for our group activity!',
        timestamp_offset_days: 1,
        tags: ['broadcast', 'logistics', 'coordination']
      },
      {
        id: 'msg_5',
        trip_type: tripType,
        sender_name: 'Alex Kim',
        message_content: 'Weather alert: Rain expected this afternoon. Bring umbrellas or jackets!',
        timestamp_offset_days: 1,
        tags: ['broadcast', 'urgent', 'weather']
      },
      
      // Emergency broadcast
      {
        id: 'msg_6',
        trip_type: tripType,
        sender_name: 'David Thompson',
        message_content: 'URGENT: Flight departure gate changed to B12. All passengers report immediately!',
        timestamp_offset_days: 0,
        tags: ['broadcast', 'emergency', 'urgent', 'travel']
      },
      
      // More regular messages
      {
        id: 'msg_7',
        trip_type: tripType,
        sender_name: 'Maya Williams',
        message_content: 'The sunset views from our hotel room are incredible! 📸',
        timestamp_offset_days: 0,
        tags: ['conversation', 'photos']
      },
      {
        id: 'msg_8',
        trip_type: tripType,
        sender_name: 'Jordan Lee',
        message_content: 'Does anyone want to split an Uber to the downtown area?',
        timestamp_offset_days: 0,
        tags: ['conversation', 'transportation']
      },
      
      // Additional broadcast
      {
        id: 'msg_9',
        trip_type: tripType,
        sender_name: 'Sofia Garcia',
        message_content: 'Reminder: Group dinner reservation is at 7:30 PM at Bella Vista. Please confirm attendance!',
        timestamp_offset_days: 0,
        tags: ['broadcast', 'logistics', 'dinner']
      },
      
      {
        id: 'msg_10',
        trip_type: tripType,
        sender_name: 'Chris Anderson',
        message_content: 'Just checked in! Room 502 if anyone needs anything 👍',
        timestamp_offset_days: 0,
        tags: ['conversation', 'checkin']
      },
      
      // Payment Messages
      {
        id: 'payment_1',
        trip_type: tripType,
        sender_name: 'Sarah Chen',
        message_content: 'Dinner at Sakura Restaurant - USD 240.00 (split 4 ways) • Pay me via Venmo: @sarahc94',
        timestamp_offset_days: 1,
        tags: ['payment', 'expense']
      },
      {
        id: 'payment_2',
        trip_type: tripType,
        sender_name: 'Marcus Johnson',
        message_content: 'Taxi to airport - USD 65.00 (split 6 ways) • Pay me via Zelle: (555) 123-4567',
        timestamp_offset_days: 0,
        tags: ['payment', 'transportation']
      },
      {
        id: 'payment_3',
        trip_type: tripType,
        sender_name: 'Alex Kim',
        message_content: 'Concert tickets - USD 180.00 (split 3 ways) • Pay me via PayPal: @alex.kim.music',
        timestamp_offset_days: 0,
        tags: ['payment', 'entertainment']
      }
    ];

    // Add trip-specific messages based on type
    const tripSpecificMessages = this.getTripSpecificMessages(tripType);
    
    return [...baseMessages, ...tripSpecificMessages].sort((a, b) => 
      (b.timestamp_offset_days || 0) - (a.timestamp_offset_days || 0)
    );
  }

  private getTripSpecificMessages(tripType: string): MockMessage[] {
    switch (tripType) {
      case 'friends-trip':
        return [
          {
            id: 'friends_1',
            trip_type: tripType,
            sender_name: 'Taylor Brooks',
            message_content: 'Pool party at 2 PM! Bring your swimsuits 🏊‍♂️🎉',
            timestamp_offset_days: 0,
            tags: ['broadcast', 'chill', 'activities']
          },
          {
            id: 'friends_2',
            trip_type: tripType,
            sender_name: 'Jamie Chen',
            message_content: 'Who wants to hit up that karaoke place tonight?',
            timestamp_offset_days: 0,
            tags: ['conversation', 'nightlife']
          }
        ];
      
      case 'family-vacation':
        return [
          {
            id: 'family_1',
            trip_type: tripType,
            sender_name: 'Mom (Linda)',
            message_content: 'Kids need to be back at the hotel by 8 PM for bedtime routine!',
            timestamp_offset_days: 0,
            tags: ['broadcast', 'logistics', 'family']
          },
          {
            id: 'family_2',
            trip_type: tripType,
            sender_name: 'Dad (Robert)',
            message_content: 'Found a great ice cream shop - meet us at the boardwalk!',
            timestamp_offset_days: 0,
            tags: ['conversation', 'activities']
          }
        ];
      
      default:
        return [];
    }
  }

  async getMockBroadcasts(tripType: string): Promise<MockBroadcast[]> {
    const baseBroadcasts: MockBroadcast[] = [
      {
        id: 'broadcast_1',
        trip_type: tripType,
        sender_name: 'Trip Coordinator',
        content: 'All luggage must be outside rooms by 8 AM for pickup tomorrow!',
        tag: 'logistics',
        timestamp_offset_hours: 12
      },
      {
        id: 'broadcast_2',
        trip_type: tripType,
        sender_name: 'Safety Team',
        content: 'EMERGENCY: Severe weather warning in effect. Stay indoors until further notice!',
        tag: 'emergency',
        timestamp_offset_hours: 6
      },
      {
        id: 'broadcast_3',
        trip_type: tripType,
        sender_name: 'Activity Leader',
        content: 'Beach volleyball tournament starts in 30 minutes at the south beach! 🏐',
        tag: 'chill',
        timestamp_offset_hours: 2
      }
    ];

    return baseBroadcasts;
  }

  disconnectUser = async () => {
    // Placeholder for GetStream disconnect logic
    console.log('Disconnecting user from GetStream (placeholder)');
    return Promise.resolve();
  };
}

export const demoModeService = new DemoModeService();
