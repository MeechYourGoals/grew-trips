import { Recommendation } from './types';

export const tourRecommendations: Recommendation[] = [
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
    isSponsored: true,
    sponsorBadge: 'Promoted',
    ctaButton: {
      text: 'Book Adventure',
      action: 'book'
    },
    externalLink: 'https://www.evergladesairboat.com/',
    userRecommendations: {
      count: 9,
      names: ['Kevin Z.', 'Emily C.', 'Ryan M.', 'Nicole S.']
    },
    distance: '45 minutes from Miami',
    isAvailable: true
  },
  {
    id: 10,
    type: 'tour',
    title: 'Miami Food & Culture Tour',
    location: 'Little Havana, Miami, FL',
    description: 'Authentic culinary journey through Little Havana with Cuban coffee, traditional pastries, and live music.',
    rating: 4.8,
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&h=400&fit=crop'
    ],
    tags: ['Cuban Culture', 'Food Tour', 'Live Music', 'Authentic'],
    isSponsored: true,
    sponsorBadge: 'Featured',
    promoText: 'Free cafecito with every tour!',
    ctaButton: {
      text: 'Join Tour',
      action: 'book'
    },
    externalLink: 'https://www.miamifoodtours.com/',
    userRecommendations: {
      count: 18,
      names: ['Maria C.', 'Jose R.', 'Cuban A.', 'Food B.']
    },
    distance: '6.1 miles from your location',
    isAvailable: true
  }
];