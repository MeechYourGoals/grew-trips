
import { Recommendation } from './types';

export const hotelRecommendations: Recommendation[] = [
  {
    id: 1,
    type: 'hotel',
    title: 'Four Seasons Ocean Drive',
    location: 'Miami Beach, FL',
    city: 'Miami',
    coordinates: { lat: 25.7617, lng: -80.1918 },
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
    externalLink: 'https://www.fourseasons.com/miamib/',
    userRecommendations: {
      count: 3,
      names: ['Sarah M.', 'Tom R.', 'Lisa K.']
    },
    distance: '0.3 miles from your hotel',
    isAvailable: true
  },
  {
    id: 7,
    type: 'hotel',
    title: 'The Setai Miami Beach',
    location: 'Miami Beach, FL',
    city: 'Miami',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    description: 'Contemporary luxury with Asian-inspired design, pristine beachfront, and award-winning spa.',
    rating: 4.9,
    priceLevel: 4,
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop'
    ],
    tags: ['Luxury', 'Beachfront', 'Spa', 'Contemporary'],
    isSponsored: true,
    sponsorBadge: 'Featured',
    promoText: 'Free room upgrade for Chravel users!',
    ctaButton: {
      text: 'Book Now',
      action: 'book'
    },
    externalLink: 'https://www.setai.com/',
    userRecommendations: {
      count: 7,
      names: ['Michael T.', 'Jessica P.', 'David L.', 'Amanda R.']
    },
    distance: '0.5 miles from your hotel',
    isAvailable: true
  }
];
