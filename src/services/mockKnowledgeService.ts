import { demoModeService } from './demoModeService';
import { SearchResult } from './universalConciergeService';

export class MockKnowledgeService {
  static async searchMockData(query: string, tripId: string): Promise<SearchResult[]> {
    const lowercaseQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Get mock messages from demo service
    const mockMessages = await demoModeService.getMockMessages('demo');
    
    // Search through mock messages
    for (const message of mockMessages) {
      if (
        message.message_content.toLowerCase().includes(lowercaseQuery) ||
        message.sender_name.toLowerCase().includes(lowercaseQuery) ||
        (message.tags && message.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
      ) {
        results.push({
          id: `mock_msg_${message.id}`,
          objectType: 'message',
          objectId: message.id,
          tripId,
          tripName: 'Demo Trip',
          content: message.message_content,
          snippet: `${message.sender_name}: ${message.message_content.substring(0, 100)}...`,
          score: 0.9,
          deepLink: '#chat',
          matchReason: 'Message content match',
          metadata: {
            date: this.getDateFromOffset(message.timestamp_offset_days || 0),
            participants: [message.sender_name]
          }
        });
      }
    }

    // Mock poll data
    if (lowercaseQuery.includes('poll') || lowercaseQuery.includes('restaurant') || lowercaseQuery.includes('vote')) {
      results.push({
        id: 'mock_poll_1',
        objectType: 'message',
        objectId: 'poll_1',
        tripId,
        tripName: 'Demo Trip',
        content: 'Restaurant poll: Where should we eat tonight?',
        snippet: 'Poll about restaurant options: Italian Bistro, Sushi Palace, Local BBQ',
        score: 0.95,
        deepLink: '#chat',
        matchReason: 'Poll content match',
        metadata: {
          date: this.getDateFromOffset(1)
        }
      });
    }

    // Mock to-do/task data
    if (lowercaseQuery.includes('todo') || lowercaseQuery.includes('task') || lowercaseQuery.includes('list')) {
      results.push({
        id: 'mock_todo_1',
        objectType: 'message',
        objectId: 'todo_1',
        tripId,
        tripName: 'Demo Trip',
        content: 'Outstanding tasks: Pack snorkeling gear, Confirm dinner reservations, Buy sunscreen',
        snippet: 'To-do items still pending completion',
        score: 0.9,
        deepLink: '#todo',
        matchReason: 'Task list match',
        metadata: {
          date: this.getDateFromOffset(0)
        }
      });
    }

    // Mock file data
    if (lowercaseQuery.includes('file') || lowercaseQuery.includes('document') || lowercaseQuery.includes('itinerary')) {
      results.push({
        id: 'mock_file_1',
        objectType: 'file',
        objectId: 'file_1',
        tripId,
        tripName: 'Demo Trip',
        content: 'Trip itinerary and hotel confirmations uploaded',
        snippet: 'Complete trip itinerary with flight details and hotel bookings',
        score: 0.85,
        deepLink: '#files',
        matchReason: 'File content match',
        metadata: {
          fileName: 'trip_itinerary.pdf',
          fileType: 'pdf',
          date: this.getDateFromOffset(3)
        }
      });
    }

    return results.slice(0, 10); // Limit to 10 results
  }

  static async generateMockAnswer(query: string, tripId: string): Promise<string> {
    const lowercaseQuery = query.toLowerCase();
    
    // Sarah Chen's recent messages
    if (lowercaseQuery.includes('sarah chen') && (lowercaseQuery.includes('recent') || lowercaseQuery.includes('latest') || lowercaseQuery.includes('last'))) {
      return "Sarah Chen's most recent message was: 'Super excited for this trip! Has everyone seen the weather forecast?' She posted this 2 days ago and seems enthusiastic about the upcoming trip.";
    }

    // Restaurant poll questions
    if (lowercaseQuery.includes('restaurant') && lowercaseQuery.includes('poll')) {
      return "The restaurant poll had three options: Italian Bistro, Sushi Palace, and Local BBQ. The poll was asking 'Where should we eat tonight?' and was created by Priya Patel yesterday.";
    }

    // To-do list items
    if (lowercaseQuery.includes('todo') || lowercaseQuery.includes('task')) {
      return "The current to-do list has these outstanding items: 1) Pack snorkeling gear, 2) Confirm dinner reservations, and 3) Buy sunscreen. These tasks are still pending completion.";
    }

    // Flight information
    if (lowercaseQuery.includes('flight') || lowercaseQuery.includes('landing')) {
      return "Marcus Johnson mentioned that he booked his flight and will be landing at 3:30 PM on Friday. There was also an urgent message from David Thompson about a gate change to B12.";
    }

    // Weather information
    if (lowercaseQuery.includes('weather')) {
      return "There have been several weather-related messages: Sarah Chen asked about the weather forecast, Alex Kim sent a weather alert about rain expected in the afternoon (recommending umbrellas or jackets), and there was an emergency broadcast about severe weather requiring everyone to stay indoors.";
    }

    // Hotel/accommodation info
    if (lowercaseQuery.includes('hotel') || lowercaseQuery.includes('room')) {
      return "Chris Anderson mentioned he checked into room 502 and offered help if anyone needs anything. Maya Williams also mentioned incredible sunset views from their hotel room. There's also a reminder that luggage must be outside rooms by 8 AM for pickup.";
    }

    // Generic fallback
    return `I found information related to your query about "${query}" in the demo trip data. The mock data includes messages from team members like Sarah Chen, Marcus Johnson, Priya Patel, and others, along with polls, tasks, and files. Is there something specific you'd like to know more about?`;
  }

  private static getDateFromOffset(offsetDays: number): string {
    const date = new Date();
    date.setDate(date.getDate() - offsetDays);
    return date.toISOString().split('T')[0];
  }

  static formatMockCitations(results: SearchResult[]): any[] {
    return results.map(result => ({
      id: result.id,
      content: result.content,
      source: result.objectType,
      trip_id: result.tripId,
      metadata: result.metadata
    }));
  }
}