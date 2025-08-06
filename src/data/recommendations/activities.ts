import { Recommendation } from './types';

export const activityRecommendations: Recommendation[] = [
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
    isSponsored: true,
    sponsorBadge: 'Promoted',
    ctaButton: {
      text: 'Book Tour',
      action: 'book'
    },
    externalLink: 'https://www.miamivicespeedboat.com/',
    userRecommendations: {
      count: 5,
      names: ['Mike D.', 'Emma W.', 'Carlos R.']
    },
    distance: '2.1 miles from your hotel',
    isAvailable: true
  },
  {
    id: 9,
    type: 'activity',
    title: 'Wynwood Art District Walking Tour',
    location: 'Wynwood, Miami, FL',
    description: 'Guided exploration of world-famous street art murals and galleries in Miami\'s vibrant arts district.',
    rating: 4.6,
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop'
    ],
    tags: ['Street Art', 'Cultural', 'Walking Tour', 'Photography'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    ctaButton: {
      text: 'Book Tour',
      action: 'book'
    },
    externalLink: 'https://www.wynwoodwalks.com/',
    userRecommendations: {
      count: 15,
      names: ['Artist M.', 'Gallery K.', 'Photo T.', 'Culture L.']
    },
    distance: '4.2 miles from your hotel',
    isAvailable: true
  }
];