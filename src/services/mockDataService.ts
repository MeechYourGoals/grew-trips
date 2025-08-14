interface MockMediaItem {
  id: string;
  media_url: string;
  filename: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  metadata: any;
  created_at: string;
  source: 'chat' | 'upload';
}

interface MockLinkItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  domain: string;
  og_image_url?: string;
  created_at: string;
  source: 'chat' | 'manual';
}

class MockDataService {
  private static readonly STORAGE_PREFIX = 'trip_mock_data_';
  private static readonly USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || import.meta.env.DEV;

  private static getMockMediaData(): MockMediaItem[] {
    return [
      {
        id: 'mock-media-1',
        media_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
        filename: 'mountain-sunset.jpg',
        media_type: 'image',
        metadata: { source: 'chat', width: 600, height: 600 },
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        source: 'chat'
      },
      {
        id: 'mock-media-2',
        media_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
        filename: 'serene-lake.jpg',
        media_type: 'image',
        metadata: { source: 'chat', width: 600, height: 600 },
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        source: 'chat'
      },
      {
        id: 'mock-media-3',
        media_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=600&fit=crop',
        filename: 'forest-trail.jpg',
        media_type: 'image',
        metadata: { source: 'upload', width: 600, height: 600 },
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        source: 'upload'
      },
      {
        id: 'mock-media-4',
        media_url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=600&fit=crop',
        filename: 'club-poster.jpg',
        media_type: 'image',
        metadata: { source: 'chat', width: 400, height: 600, type: 'poster' },
        created_at: new Date(Date.now() - 86400000).toISOString(),
        source: 'chat'
      },
      {
        id: 'mock-media-5',
        media_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        filename: 'trip-highlights.mp4',
        media_type: 'video',
        metadata: { source: 'chat', duration: 30, width: 1280, height: 720 },
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        source: 'chat'
      },
      {
        id: 'mock-media-6',
        media_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
        filename: 'adventure-moments.mp4',
        media_type: 'video',
        metadata: { source: 'upload', duration: 15, width: 640, height: 360 },
        created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
        source: 'upload'
      }
    ];
  }

  private static getMockLinksData(): MockLinkItem[] {
    return [
      {
        id: 'mock-link-1',
        url: 'https://www.nytimes.com/2024/08/14/travel/best-summer-destinations.html',
        title: 'The 20 Best Summer Travel Destinations You Need to Visit',
        description: 'From hidden beaches to mountain retreats, discover the most stunning places to visit this summer season.',
        domain: 'nytimes.com',
        og_image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        source: 'chat'
      },
      {
        id: 'mock-link-2',
        url: 'https://maps.google.com/place/central-park-new-york',
        title: 'Central Park - Google Maps',
        description: 'Iconic urban park in Manhattan with lakes, meadows, and recreational facilities.',
        domain: 'maps.google.com',
        og_image_url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=400&h=200&fit=crop',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        source: 'manual'
      },
      {
        id: 'mock-link-3',
        url: 'https://www.ticketmaster.com/event/summer-music-festival-2024',
        title: 'Summer Music Festival 2024 - Official Tickets',
        description: 'Join us for the biggest music festival of the year featuring top artists and incredible performances.',
        domain: 'ticketmaster.com',
        og_image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=200&fit=crop',
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        source: 'chat'
      },
      {
        id: 'mock-link-4',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Amazing Travel Vlog: Epic Adventure Highlights',
        description: 'Watch our incredible journey through the most beautiful destinations around the world.',
        domain: 'youtube.com',
        og_image_url: 'https://images.unsplash.com/photo-1533603732389-4d9d2a15ebe0?w=400&h=200&fit=crop',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        source: 'chat'
      },
      {
        id: 'mock-link-5',
        url: 'https://www.instagram.com/p/amazing-sunset-view',
        title: 'Epic sunset view from our trip! 🌅',
        description: 'The most incredible sunset we\'ve ever seen during our adventure.',
        domain: 'instagram.com',
        og_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        source: 'chat'
      },
      {
        id: 'mock-link-6',
        url: 'https://www.booking.com/hotel/luxury-mountain-resort',
        title: 'Luxury Mountain Resort & Spa - Book Direct',
        description: 'Experience ultimate relaxation at our award-winning mountain resort with world-class amenities.',
        domain: 'booking.com',
        og_image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop',
        created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
        source: 'manual'
      },
      {
        id: 'mock-link-7',
        url: 'https://www.airbnb.com/rooms/cozy-cabin-mountains',
        title: 'Cozy Cabin in the Mountains - Airbnb',
        description: 'Perfect getaway with stunning views, hot tub, and hiking trails right outside your door.',
        domain: 'airbnb.com',
        og_image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop',
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        source: 'manual'
      },
      {
        id: 'mock-link-8',
        url: 'https://www.timeout.com/newyork/restaurants/best-restaurants-nyc',
        title: 'The 50 Best Restaurants in NYC Right Now',
        description: 'From hole-in-the-wall gems to Michelin-starred establishments, discover NYC\'s culinary scene.',
        domain: 'timeout.com',
        og_image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop',
        created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
        source: 'chat'
      }
    ];
  }

  static isUsingMockData(): boolean {
    return this.USE_MOCK_DATA;
  }

  static getStorageKey(tripId: string, type: 'media' | 'links'): string {
    return `${this.STORAGE_PREFIX}${tripId}_${type}`;
  }

  static getMockMediaItems(tripId: string): MockMediaItem[] {
    if (!this.USE_MOCK_DATA) return [];
    
    const storageKey = this.getStorageKey(tripId, 'media');
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to parse stored mock media data:', error);
      }
    }
    
    // First time - initialize with mock data
    const mockData = this.getMockMediaData();
    localStorage.setItem(storageKey, JSON.stringify(mockData));
    return mockData;
  }

  static getMockLinkItems(tripId: string): MockLinkItem[] {
    if (!this.USE_MOCK_DATA) return [];
    
    const storageKey = this.getStorageKey(tripId, 'links');
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to parse stored mock link data:', error);
      }
    }
    
    // First time - initialize with mock data
    const mockData = this.getMockLinksData();
    localStorage.setItem(storageKey, JSON.stringify(mockData));
    return mockData;
  }

  static reseedMockData(tripId: string): void {
    if (!this.USE_MOCK_DATA) return;
    
    // Clear existing data
    localStorage.removeItem(this.getStorageKey(tripId, 'media'));
    localStorage.removeItem(this.getStorageKey(tripId, 'links'));
    
    // Reinitialize
    this.getMockMediaItems(tripId);
    this.getMockLinkItems(tripId);
    
    console.log('Mock data reseeded for trip:', tripId);
  }

  static clearMockData(tripId?: string): void {
    if (tripId) {
      localStorage.removeItem(this.getStorageKey(tripId, 'media'));
      localStorage.removeItem(this.getStorageKey(tripId, 'links'));
    } else {
      // Clear all mock data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
  }
}

export default MockDataService;
export type { MockMediaItem, MockLinkItem };