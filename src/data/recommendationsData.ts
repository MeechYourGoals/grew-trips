export interface Recommendation {
  id: number;
  type: 'hotel' | 'restaurant' | 'activity' | 'tour' | 'experience';
  title: string;
  location: string;
  description: string;
  rating: number;
  priceLevel: 1 | 2 | 3 | 4; // $ to $$$$
  images: string[];
  tags: string[];
  isSponsored: boolean;
  sponsorBadge?: string;
  promoText?: string;
  ctaButton: {
    text: string;
    action: 'book' | 'reserve' | 'view' | 'save';
  };
  userRecommendations?: {
    count: number;
    names: string[];
  };
  distance?: string;
  isAvailable: boolean;
}

export const recommendationsData: Recommendation[] = [
  {
    id: 1,
    type: 'hotel',
    title: 'Four Seasons Ocean Drive',
    location: 'Miami Beach, FL',
    description: 'Luxury beachfront hotel with stunning ocean views, world-class spa, and rooftop pool.',
    rating: 4.8,
    priceLevel: 4,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop'
    ],
    tags: ['Luxury', 'Beachfront', 'Spa', 'Pool'],
    isSponsored: true,
    sponsorBadge: 'Featured',
    promoText: '10% off for Chravel users!',
    ctaButton: {
      text: 'Book Now',
      action: 'book'
    },
    userRecommendations: {
      count: 3,
      names: ['Sarah M.', 'Tom R.', 'Lisa K.']
    },
    distance: '0.3 miles from your hotel',
    isAvailable: true
  },
  {
    id: 2,
    type: 'restaurant',
    title: "Joe's Stone Crab",
    location: 'Miami Beach, FL',
    description: 'Iconic Miami dining institution serving the finest stone crab since 1913. Seasonal menu with fresh seafood.',
    rating: 4.6,
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&h=400&fit=crop'
    ],
    tags: ['Seafood', 'Historic', 'Fine Dining', 'Stone Crab'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    ctaButton: {
      text: 'Reserve',
      action: 'reserve'
    },
    userRecommendations: {
      count: 8,
      names: ['Tom R.', 'Maria S.', 'Alex P.', 'Jennifer L.']
    },
    distance: '1.2 miles from your location',
    isAvailable: true
  },
  {
    id: 3,
    type: 'activity',
    title: 'Miami Vice Speedboat Tour',
    location: 'Downtown Miami, FL',
    description: 'High-speed adventure through Biscayne Bay with celebrity home tours and Miami skyline views.',
    rating: 4.7,
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop'
    ],
    tags: ['Adventure', 'Sightseeing', 'Water Sports', 'Speedboat'],
    isSponsored: false,
    ctaButton: {
      text: 'Book Tour',
      action: 'book'
    },
    userRecommendations: {
      count: 5,
      names: ['Mike D.', 'Emma W.', 'Carlos R.']
    },
    distance: '2.1 miles from your hotel',
    isAvailable: true
  },
  {
    id: 4,
    type: 'experience',
    title: 'Art Deco Walking Tour',
    location: 'South Beach, FL',
    description: 'Guided tour through the largest collection of Art Deco architecture in the world.',
    rating: 4.4,
    priceLevel: 1,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop'
    ],
    tags: ['Architecture', 'Walking Tour', 'History', 'Cultural'],
    isSponsored: false,
    ctaButton: {
      text: 'Join Tour',
      action: 'book'
    },
    userRecommendations: {
      count: 12,
      names: ['Anna B.', 'David L.', 'Rachel M.', 'James K.']
    },
    distance: '0.8 miles from your location',
    isAvailable: true
  },
  {
    id: 5,
    type: 'restaurant',
    title: 'Komodo Miami',
    location: 'Brickell, FL',
    description: 'Southeast Asian cuisine in a stunning multi-level venue with indoor and outdoor dining.',
    rating: 4.5,
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop'
    ],
    tags: ['Asian Fusion', 'Trendy', 'Outdoor Dining', 'Nightlife'],
    isSponsored: true,
    sponsorBadge: 'Featured',
    promoText: 'Complimentary appetizer with reservation',
    ctaButton: {
      text: 'Reserve Table',
      action: 'reserve'
    },
    userRecommendations: {
      count: 6,
      names: ['Sophia C.', 'Marcus T.', 'Isabella R.']
    },
    distance: '3.2 miles from your hotel',
    isAvailable: true
  },
  {
    id: 6,
    type: 'tour',
    title: 'Everglades Airboat Adventure',
    location: 'Everglades National Park, FL',
    description: 'Thrilling airboat ride through the Everglades with wildlife viewing and gator encounters.',
    rating: 4.6,
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1548366086-7f1b76106622?w=600&h=400&fit=crop'
    ],
    tags: ['Wildlife', 'Adventure', 'Nature', 'Airboat'],
    isSponsored: false,
    ctaButton: {
      text: 'Book Adventure',
      action: 'book'
    },
    userRecommendations: {
      count: 9,
      names: ['Kevin Z.', 'Emily C.', 'Ryan M.', 'Nicole S.']
    },
    distance: '45 minutes from Miami',
    isAvailable: true
  }
];

export const getRecommendationsByType = (type?: string): Recommendation[] => {
  if (!type || type === 'all') return recommendationsData;
  return recommendationsData.filter(rec => rec.type === type);
};

export const getSponsoredRecommendations = (): Recommendation[] => {
  return recommendationsData.filter(rec => rec.isSponsored);
};

export const getRecommendationById = (id: number): Recommendation | null => {
  return recommendationsData.find(rec => rec.id === id) || null;
};