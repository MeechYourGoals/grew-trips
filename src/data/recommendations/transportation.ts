
import { Recommendation } from './types';

export const transportationRecommendations: Recommendation[] = [
  // American Airlines
  {
    id: 101,
    type: 'transportation',
    title: 'American Airlines - Premium Flight Experience',
    location: 'Miami International Airport, FL',
    city: 'Miami',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    description: 'Earn 5,000 bonus AAdvantage miles on your next Miami flight. Premium cabin upgrades available.',
    rating: 4.6,
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop'
    ],
    tags: ['Airline', 'Miles Rewards', 'Premium Service'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: '5,000 bonus miles for Chravel users!',
    ctaButton: {
      text: 'Book Flight',
      action: 'book'
    },
    externalLink: 'https://www.aa.com/',
    distance: '12 miles from your location',
    isAvailable: true
  },
  {
    id: 102,
    type: 'transportation',
    title: 'American Airlines - Business Class Special',
    location: 'Los Angeles International Airport, CA',
    city: 'Los Angeles',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    description: 'Exclusive Chravel offer: Save 15% on Business Class bookings with priority boarding and lounge access.',
    rating: 4.7,
    priceLevel: 4,
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop'
    ],
    tags: ['Airline', 'Business Class', 'Exclusive Offer'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: '15% off Business Class',
    ctaButton: {
      text: 'Book Now',
      action: 'book'
    },
    externalLink: 'https://www.aa.com/',
    distance: '8 miles from your location',
    isAvailable: true
  },
  
  // Delta Airlines
  {
    id: 103,
    type: 'transportation',
    title: 'Delta Airlines - SkyMiles Accelerator',
    location: 'John F. Kennedy International Airport, NY',
    city: 'New York',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    description: 'Double SkyMiles on all domestic flights booked through Chravel. Premium seat selection included.',
    rating: 4.8,
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&h=400&fit=crop'
    ],
    tags: ['Airline', 'SkyMiles', 'Domestic Flights'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Double SkyMiles for Chravel users!',
    ctaButton: {
      text: 'Earn Miles',
      action: 'book'
    },
    externalLink: 'https://www.delta.com/',
    distance: '15 miles from your location',
    isAvailable: true
  },
  {
    id: 104,
    type: 'transportation',
    title: 'Delta Airlines - International Comfort+',
    location: 'Hartsfield-Jackson Atlanta International Airport, GA',
    city: 'Atlanta',
    coordinates: { lat: 33.7490, lng: -84.3880 },
    description: 'Upgrade to Comfort+ on international routes with extra legroom, priority boarding, and complimentary drinks.',
    rating: 4.5,
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1556388158-158dc515f85b?w=600&h=400&fit=crop'
    ],
    tags: ['Airline', 'Comfort+', 'International'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Free Comfort+ upgrade available',
    ctaButton: {
      text: 'Upgrade Now',
      action: 'book'
    },
    externalLink: 'https://www.delta.com/',
    distance: '22 miles from your location',
    isAvailable: true
  },

  // Hertz
  {
    id: 105,
    type: 'transportation',
    title: 'Hertz - Premium Car Rental',
    location: 'Miami Beach, FL',
    city: 'Miami',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    description: 'Chravel Exclusive: 20% off all luxury and premium vehicle rentals. Free additional driver included.',
    rating: 4.4,
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop'
    ],
    tags: ['Car Rental', 'Luxury Vehicles', 'Premium Service'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: '20% off luxury rentals',
    ctaButton: {
      text: 'Reserve Car',
      action: 'reserve'
    },
    externalLink: 'https://www.hertz.com/',
    distance: '0.8 miles from your hotel',
    isAvailable: true
  },
  {
    id: 106,
    type: 'transportation',
    title: 'Hertz - Airport Express Service',
    location: 'Los Angeles International Airport, CA',
    city: 'Los Angeles',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    description: 'Skip the counter with Hertz Gold Plus Rewards. Express pickup and return service at LAX.',
    rating: 4.6,
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1502489597346-dad15683d4c2?w=600&h=400&fit=crop'
    ],
    tags: ['Car Rental', 'Airport Service', 'Express Pickup'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Skip the counter - Express service',
    ctaButton: {
      text: 'Book Express',
      action: 'book'
    },
    externalLink: 'https://www.hertz.com/',
    distance: '2 miles from airport',
    isAvailable: true
  },

  // Uber
  {
    id: 107,
    type: 'transportation',
    title: 'Uber - Premium Airport Rides',
    location: 'Miami, FL',
    city: 'Miami',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    description: 'Flat $10 off airport rides for Chravel users. Choose from Uber Black, Uber Comfort, or UberX.',
    rating: 4.5,
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&h=400&fit=crop'
    ],
    tags: ['Rideshare', 'Airport Transfer', 'Premium Service'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: '$10 off airport rides',
    ctaButton: {
      text: 'Get Ride',
      action: 'book'
    },
    externalLink: 'https://www.uber.com/',
    distance: 'Available citywide',
    isAvailable: true
  },
  {
    id: 108,
    type: 'transportation',
    title: 'Uber - Group Travel Solutions',
    location: 'New York, NY',
    city: 'New York',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    description: 'Uber XL and Uber Black SUV for your group trips. Reliable transportation for 6+ passengers.',
    rating: 4.7,
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop'
    ],
    tags: ['Rideshare', 'Group Travel', 'SUV Service'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Perfect for group trips',
    ctaButton: {
      text: 'Book Group Ride',
      action: 'book'
    },
    externalLink: 'https://www.uber.com/',
    distance: 'Available citywide',
    isAvailable: true
  },

  // Waymo
  {
    id: 109,
    type: 'transportation',
    title: 'Waymo - Autonomous Ride Experience',
    location: 'San Francisco, CA',
    city: 'San Francisco',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    description: 'Experience the future of transportation with Waymo\'s self-driving vehicles. Safe, reliable, and innovative.',
    rating: 4.3,
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    ],
    tags: ['Autonomous', 'Self-Driving', 'Innovation'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'First ride free for new users',
    ctaButton: {
      text: 'Try Waymo',
      action: 'book'
    },
    externalLink: 'https://waymo.com/',
    distance: 'Available in select areas',
    isAvailable: true
  },
  {
    id: 110,
    type: 'transportation',
    title: 'Waymo - Airport Connections',
    location: 'Phoenix Sky Harbor International Airport, AZ',
    city: 'Phoenix',
    coordinates: { lat: 33.4484, lng: -112.0740 },
    description: 'Seamless airport transfers with Waymo\'s autonomous vehicles. Pre-book your ride for guaranteed availability.',
    rating: 4.4,
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400&fit=crop'
    ],
    tags: ['Autonomous', 'Airport Transfer', 'Pre-booking'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Pre-book for guaranteed rides',
    ctaButton: {
      text: 'Pre-book Ride',
      action: 'book'
    },
    externalLink: 'https://waymo.com/',
    distance: '5 miles from airport',
    isAvailable: true
  },

  // Orbitz
  {
    id: 111,
    type: 'transportation',
    title: 'Orbitz - Complete Travel Packages',
    location: 'Multiple Cities',
    city: 'Miami',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    description: 'Bundle flights, hotels, and car rentals for maximum savings. Exclusive Chravel member discounts available.',
    rating: 4.2,
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop'
    ],
    tags: ['Travel Booking', 'Package Deals', 'Multi-Service'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Save more when you bundle',
    ctaButton: {
      text: 'View Packages',
      action: 'view'
    },
    externalLink: 'https://www.orbitz.com/',
    distance: 'Worldwide availability',
    isAvailable: true
  },
  {
    id: 112,
    type: 'transportation',
    title: 'Orbitz - Last-Minute Flight Deals',
    location: 'All Major Airports',
    city: 'Los Angeles',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    description: 'Score incredible last-minute flight deals. Mobile-exclusive offers and instant booking confirmation.',
    rating: 4.3,
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&h=400&fit=crop'
    ],
    tags: ['Travel Booking', 'Last-Minute Deals', 'Mobile Exclusive'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Mobile-exclusive last-minute deals',
    ctaButton: {
      text: 'See Deals',
      action: 'view'
    },
    externalLink: 'https://www.orbitz.com/',
    distance: 'All locations',
    isAvailable: true
  },

  // Navan
  {
    id: 113,
    type: 'transportation',
    title: 'Navan - Corporate Travel Management',
    location: 'Business Travel Worldwide',
    city: 'New York',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    description: 'Streamline your business travel with Navan\'s integrated booking platform. Policy compliance and expense tracking included.',
    rating: 4.6,
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop'
    ],
    tags: ['Corporate Travel', 'Business Management', 'Expense Tracking'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Enterprise-grade travel solution',
    ctaButton: {
      text: 'Get Quote',
      action: 'view'
    },
    externalLink: 'https://navan.com/',
    distance: 'Global coverage',
    isAvailable: true
  },
  {
    id: 114,
    type: 'transportation',
    title: 'Navan - Team Travel Coordination',
    location: 'Multi-City Business Travel',
    city: 'Atlanta',
    coordinates: { lat: 33.7490, lng: -84.3880 },
    description: 'Coordinate team travel with automated approvals, real-time tracking, and integrated expense management.',
    rating: 4.8,
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop'
    ],
    tags: ['Corporate Travel', 'Team Coordination', 'Automated Approvals'],
    isSponsored: true,
    sponsorBadge: 'Promoted',
    promoText: 'Perfect for team travel',
    ctaButton: {
      text: 'Start Trial',
      action: 'view'
    },
    externalLink: 'https://navan.com/',
    distance: 'Available for teams',
    isAvailable: true
  }
];
