import { Recommendation } from './types';

export const experienceRecommendations: Recommendation[] = [
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
    isSponsored: true,
    sponsorBadge: 'Promoted',
    ctaButton: {
      text: 'Join Tour',
      action: 'book'
    },
    externalLink: 'https://www.artdecomiami.com/',
    userRecommendations: {
      count: 12,
      names: ['Anna B.', 'David L.', 'Rachel M.', 'James K.']
    },
    distance: '0.8 miles from your location',
    isAvailable: true
  },
  {
    id: 11,
    type: 'experience',
    title: 'VIP Nightclub Package at LIV',
    location: 'South Beach, Miami, FL',
    description: 'Exclusive VIP table service at Miami\'s premier nightclub with bottle service and priority entry.',
    rating: 4.5,
    priceLevel: 4,
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1574391884720-bbc428f95817?w=600&h=400&fit=crop'
    ],
    tags: ['VIP', 'Nightlife', 'Bottle Service', 'Exclusive'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Skip the line with VIP access!',
    ctaButton: {
      text: 'Reserve VIP',
      action: 'book'
    },
    externalLink: 'https://www.livnightclub.com/',
    userRecommendations: {
      count: 9,
      names: ['Party A.', 'VIP B.', 'Night C.']
    },
    distance: '1.1 miles from your hotel',
    isAvailable: true
  }
];