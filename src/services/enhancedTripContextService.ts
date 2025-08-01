import { Trip, getTripById, generateTripMockData } from '../data/tripsData';
import { proTripMockData } from '../data/proTripMockData';
import { ProTripData } from '../types/pro';
import { TripContext, TripFile, TripPhoto, TripLink, TripPoll, ChatMessage, TripReceipt } from '../types/tripContext';

export class EnhancedTripContextService {
  static async getEnhancedTripContext(tripId: string, isProTrip = false): Promise<TripContext> {
    try {
      let baseContext: TripContext;
      
      if (isProTrip) {
        baseContext = await this.getProTripContext(tripId);
      } else {
        baseContext = await this.getConsumerTripContext(tripId);
      }

      // Enhance with comprehensive data
      const enhancedContext = await this.enhanceWithContextualData(baseContext);
      
      return enhancedContext;
    } catch (error) {
      console.error('Error fetching enhanced trip context:', error);
      throw new Error('Failed to fetch enhanced trip context');
    }
  }

  private static async getConsumerTripContext(tripId: string): Promise<TripContext> {
    const trip = getTripById(parseInt(tripId));
    if (!trip) {
      throw new Error('Trip not found');
    }

    const mockData = generateTripMockData(trip);
    const today = new Date().toISOString().split('T')[0];

    return {
      tripId,
      title: trip.title,
      location: trip.location,
      dateRange: trip.dateRange,
      participants: trip.participants.map(p => ({ id: p.id.toString(), name: p.name, role: 'participant' })),
      itinerary: mockData.itinerary.map((day, index) => ({
        id: index.toString(),
        title: `Day ${index + 1}`,
        date: day.date,
        events: day.events
      })),
      accommodation: typeof mockData.basecamp === 'object' 
        ? { name: mockData.basecamp.name, address: mockData.basecamp.address, checkIn: '', checkOut: '' }
        : mockData.basecamp,
      currentDate: today,
      upcomingEvents: this.getUpcomingEvents(mockData.itinerary, today),
      recentUpdates: mockData.broadcasts.map((b, i) => ({
        id: i.toString(),
        type: 'broadcast',
        message: b.content,
        timestamp: b.timestamp
      })),
      confirmationNumbers: {
        hotel: 'HTL-' + Math.random().toString(36).substr(2, 9),
        rental_car: 'CAR-' + Math.random().toString(36).substr(2, 9),
        flight: 'FLT-' + Math.random().toString(36).substr(2, 9),
      },
      basecamp: mockData.basecamp
    };
  }

  private static async getProTripContext(tripId: string): Promise<TripContext> {
    const proTrip: ProTripData = proTripMockData[tripId];
    if (!proTrip) {
      throw new Error('Pro trip not found');
    }

    const today = new Date().toISOString().split('T')[0];

    return {
      tripId,
      title: proTrip.title,
      location: proTrip.location,
      dateRange: proTrip.dateRange,
      participants: proTrip.participants.map(p => ({ id: p.id.toString(), name: p.name, role: p.role })),
      itinerary: (proTrip.itinerary || []).map((day, index) => ({
        id: index.toString(),
        title: `Day ${index + 1}`,
        date: day.date,
        events: day.events
      })),
      accommodation: `${proTrip.location} Accommodation`,
      currentDate: today,
      upcomingEvents: this.getUpcomingEvents(proTrip.itinerary || [], today),
      recentUpdates: [{
        id: '1',
        type: 'description',
        message: proTrip.description,
        timestamp: today
      }],
      confirmationNumbers: {
        venue: 'VEN-' + Math.random().toString(36).substr(2, 9),
        transportation: 'TRN-' + Math.random().toString(36).substr(2, 9),
        equipment: 'EQP-' + Math.random().toString(36).substr(2, 9),
      },
      isPro: true,
      proData: {
        category: proTrip.category || 'professional',
        equipment: (proTrip.equipment || []).map(e => typeof e === 'string' ? e : e.name)
      }
    };
  }

  private static async enhanceWithContextualData(context: TripContext): Promise<TripContext> {
    // Enhance with files data
    const files = await this.getTripFiles(context.tripId);
    const photos = await this.getTripPhotos(context.tripId);
    const links = await this.getTripLinks(context.tripId);
    const polls = await this.getTripPolls(context.tripId);
    const chatHistory = await this.getChatHistory(context.tripId);
    const receipts = await this.getTripReceipts(context.tripId);
    const preferences = await this.getTripPreferences(context.tripId);
    
    // Analyze patterns
    const spendingPatterns = this.analyzeSpendingPatterns(receipts);
    const groupDynamics = this.analyzeGroupDynamics(chatHistory, polls);
    const visitedPlaces = this.extractVisitedPlaces(context.itinerary, photos);
    const weatherContext = await this.getWeatherContext(context.location);

    return {
      ...context,
      files,
      photos,
      links,
      polls,
      chatHistory: chatHistory.slice(-20), // Keep recent messages
      receipts,
      preferences,
      spendingPatterns,
      groupDynamics,
      visitedPlaces,
      weatherContext
    };
  }

  private static async getTripFiles(tripId: string): Promise<TripFile[]> {
    // Mock files data with AI extracted content
    return [
      {
        id: '1',
        name: 'Dodgers Game Tickets.pdf',
        type: 'application/pdf',
        content: 'LA Dodgers vs SF Giants, February 15, 2025, 7:10 PM, Dodger Stadium',
        extractedEvents: 1,
        aiSummary: 'Baseball game tickets for February 15th at Dodger Stadium',
        uploadedBy: 'John Smith',
        uploadedAt: '2025-01-15T10:30:00Z'
      },
      {
        id: '2', 
        name: 'Restaurant Menu.jpg',
        type: 'image/jpeg',
        content: 'Le Comptoir French Restaurant - Prix fixe menu $85, Wine pairing available',
        aiSummary: 'Upscale French restaurant menu with prix fixe dining option',
        uploadedBy: 'Sarah Wilson',
        uploadedAt: '2025-01-14T16:45:00Z'
      }
    ];
  }

  private static async getTripPhotos(tripId: string): Promise<TripPhoto[]> {
    return [
      {
        id: 'photo-1',
        url: '/src/assets/vacation-beach-group.jpg',
        caption: 'Beach day with the crew! 🏖️',
        location: 'Santa Monica Beach',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'Marcus',
        aiTags: ['beach', 'group', 'outdoor', 'sunny', 'recreational']
      },
      {
        id: 'photo-2',
        url: '/src/assets/vacation-landmark-selfie.jpg', 
        caption: 'Epic group selfie at the landmark!',
        location: 'Hollywood Sign Viewpoint',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'Sarah',
        aiTags: ['landmark', 'selfie', 'group', 'tourist', 'scenic']
      }
    ];
  }

  private static async getTripLinks(tripId: string): Promise<TripLink[]> {
    return [
      {
        id: 'link-1',
        url: 'https://www.yelp.com/biz/republique-los-angeles',
        title: 'Republique Restaurant',
        description: 'French bistro in Mid-City with great brunch and dinner',
        category: 'restaurant',
        votes: 8,
        addedBy: 'Emma',
        addedAt: '2025-01-14T14:20:00Z'
      },
      {
        id: 'link-2',
        url: 'https://www.timeout.com/los-angeles/art/best-museums-in-los-angeles',
        title: 'Best Museums in LA',
        description: 'Guide to top art museums and cultural attractions',
        category: 'activities',
        votes: 5,
        addedBy: 'Alex',
        addedAt: '2025-01-15T09:15:00Z'
      }
    ];
  }

  private static async getTripPolls(tripId: string): Promise<TripPoll[]> {
    return [
      {
        id: 'poll-1',
        question: 'What should we do Sunday afternoon?',
        options: [
          { id: 'opt-1', text: 'Beach time at Santa Monica', votes: 6 },
          { id: 'opt-2', text: 'Museum hopping', votes: 3 },
          { id: 'opt-3', text: 'Shopping on Melrose', votes: 2 }
        ],
        totalVotes: 11,
        createdBy: 'Sarah',
        createdAt: '2025-01-15T11:30:00Z',
        status: 'active'
      }
    ];
  }

  private static async getChatHistory(tripId: string): Promise<ChatMessage[]> {
    return [
      {
        id: 'msg-1',
        content: 'Super excited for this trip! The weather looks perfect ☀️',
        author: 'Emma',
        timestamp: '2025-01-15T09:30:00Z',
        sentiment: 'positive'
      },
      {
        id: 'msg-2', 
        content: 'Should we make dinner reservations somewhere nice for Saturday?',
        author: 'Alex',
        timestamp: '2025-01-15T10:15:00Z',
        sentiment: 'neutral'
      },
      {
        id: 'msg-3',
        content: 'I found this amazing rooftop bar with great views!',
        author: 'Marcus',
        timestamp: '2025-01-15T11:45:00Z',
        sentiment: 'positive'
      }
    ];
  }

  private static async getTripReceipts(tripId: string): Promise<TripReceipt[]> {
    return [
      {
        id: 'receipt-1',
        amount: 156.80,
        currency: 'USD',
        description: 'Dinner at Le Comptoir',
        category: 'food',
        splitBetween: 4,
        uploadedBy: 'Emma',
        uploadedAt: '2025-01-15T19:30:00Z'
      },
      {
        id: 'receipt-2',
        amount: 89.50,
        currency: 'USD', 
        description: 'Uber to airport',
        category: 'transport',
        splitBetween: 3,
        uploadedBy: 'Alex',
        uploadedAt: '2025-01-15T08:15:00Z'
      }
    ];
  }

  private static async getTripPreferences(tripId: string): Promise<any> {
    return {
      dietary: ['Vegetarian', 'Gluten-free'],
      vibe: ['Adventure', 'Cultural', 'Nightlife'],
      accessibility: ['Pet Friendly'],
      business: [],
      entertainment: ['Live Music', 'Art'],
      lifestyle: ['Locally Owned', 'Outdoor'],
      budgetMin: 50,
      budgetMax: 150,
      timePreference: 'flexible'
    };
  }

  private static analyzeSpendingPatterns(receipts: TripReceipt[]) {
    const totalSpent = receipts.reduce((sum, r) => sum + r.amount, 0);
    const categories = receipts.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount;
      return acc;
    }, {} as { [category: string]: number });
    
    const avgPerPerson = receipts.reduce((sum, r) => sum + (r.amount / r.splitBetween), 0);

    return { totalSpent, categories, avgPerPerson };
  }

  private static analyzeGroupDynamics(chatHistory: ChatMessage[], polls: TripPoll[]) {
    const messageCount = chatHistory.reduce((acc, msg) => {
      acc[msg.author] = (acc[msg.author] || 0) + 1;
      return acc;
    }, {} as { [author: string]: number });

    const mostActiveParticipants = Object.entries(messageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);

    const recentDecisions = polls
      .filter(p => p.status === 'closed')
      .map(p => {
        const winner = p.options.reduce((max, opt) => opt.votes > max.votes ? opt : max);
        return `${p.question}: ${winner.text}`;
      });

    const positiveMessages = chatHistory.filter(m => m.sentiment === 'positive').length;
    const consensusLevel: 'high' | 'medium' | 'low' = positiveMessages / chatHistory.length > 0.7 ? 'high' : 
                          positiveMessages / chatHistory.length > 0.4 ? 'medium' : 'low';

    return { mostActiveParticipants, recentDecisions, consensusLevel };
  }

  private static extractVisitedPlaces(itinerary: any[], photos: TripPhoto[]): string[] {
    const places = new Set<string>();
    
    // From itinerary
    itinerary.forEach(day => {
      day.events?.forEach((event: any) => {
        if (event.location) places.add(event.location);
      });
    });

    // From photos
    photos.forEach(photo => {
      if (photo.location) places.add(photo.location);
    });

    return Array.from(places);
  }

  private static async getWeatherContext(location: string) {
    // Mock weather data
    return {
      current: 'Sunny, 72°F',
      forecast: ['Sunny, 75°F', 'Partly cloudy, 70°F', 'Sunny, 78°F']
    };
  }

  private static getUpcomingEvents(itinerary: any[], currentDate: string): any[] {
    return itinerary
      .filter(day => day.date >= currentDate)
      .flatMap(day => 
        day.events?.map((event: any) => ({
          ...event,
          date: day.date
        })) || []
      )
      .slice(0, 5);
  }
}