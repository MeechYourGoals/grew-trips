
import { Recommendation } from './types';

export const restaurantRecommendations: Recommendation[] = [
  {
    id: 2,
    type: 'restaurant',
    title: "Joe's Stone Crab",
    location: 'Miami Beach, FL',
    city: 'Miami',
    coordinates: { lat: 25.7617, lng: -80.1918 },
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
    externalLink: 'https://www.joesstonecrab.com/',
    userRecommendations: {
      count: 8,
      names: ['Tom R.', 'Maria S.', 'Alex P.', 'Jennifer L.']
    },
    distance: '1.2 miles from your location',
    isAvailable: true
  },
  {
    id: 5,
    type: 'restaurant',
    title: 'Komodo Miami',
    location: 'Brickell, FL',
    city: 'Miami',
    coordinates: { lat: 25.7617, lng: -80.1918 },
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
    externalLink: 'https://komodomiami.com/',
    userRecommendations: {
      count: 6,
      names: ['Sophia C.', 'Marcus T.', 'Isabella R.']
    },
    distance: '3.2 miles from your hotel',
    isAvailable: true
  },
  {
    id: 8,
    type: 'restaurant',
    title: 'Zuma Miami',
    location: 'Downtown Miami, FL',
    city: 'Miami',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    description: 'Contemporary Japanese robatayaki cuisine with stunning Biscayne Bay views and premium sake selection.',
    rating: 4.7,
    priceLevel: 4,
    images: [
      'https://images.unsplash.com/photo-1552566635-dcc4ec5f7077?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop'
    ],
    tags: ['Japanese', 'Robatayaki', 'Waterfront', 'Premium'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Complimentary sake tasting with dinner',
    ctaButton: {
      text: 'Reserve',
      action: 'reserve'
    },
    externalLink: 'https://zumarestaurant.com/locations/miami/',
    userRecommendations: {
      count: 11,
      names: ['Carlos M.', 'Elena V.', 'Robert K.', 'Diana S.']
    },
    distance: '2.8 miles from your location',
    isAvailable: true
  }
];
