import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TRIPS_PLUS_PRICE, TRIPS_PLUS_ANNUAL_PRICE } from '../../types/consumer';
import { 
  Check, 
  Crown, 
  Building, 
  CalendarPlus, 
  Star,
  Users,
  Shield,
  Zap,
  BarChart3,
  Phone,
  Camera
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  cta: string;
  popular?: boolean;
  enterprise?: boolean;
  ctaAction?: () => void;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Try Chravel free for up to 5 trips. To add another, simply delete a past trip.',
    icon: <Users size={24} />,
    features: [
      'Up to 5 trips (delete to add new)',
      'Basic group chat',
      'Group to-do list',
      'Shared trip calendar',
      'Simple itinerary planning',
      'Up to 10 participants'
    ],
    cta: 'Get Started Free'
  },
  {
    id: 'plus',
    name: 'Chravel Plus',
    price: '$9.99',
    description: 'All the best of Chravel: AI concierge, unlimited trips, smart recommendations, photo sharing, and more.',
    icon: <Crown size={24} />,
    features: [
      'Everything in Free',
      'Unlimited trips',
      'Unlimited participants',
      'Photo sharing',
      'AI Concierge chat',
      'Smart recommendations',
      'Basecamp intelligence',
      'Advanced preferences',
      'Priority support'
    ],
    cta: 'Start 7-Day Trial',
    popular: true
  },
  {
    id: 'pro',
    name: 'Chravel Pro',
    price: 'Custom',
    description: 'Enterprise trip management',
    icon: <Building size={24} />,
    features: [
      'Everything in Plus',
      'Team management & roles',
      'Advanced budget tracking',
      'Analytics dashboard',
      'API access',
      'SSO integration',
      '24/7 priority support',
      'Custom integrations'
    ],
    cta: 'Schedule Demo',
    ctaAction: () => window.location.href = 'mailto:christian@chravelapp.com?subject=Requesting%20a%20Chravel%20Demo',
    enterprise: true
  },
  {
    id: 'events',
    name: 'Chravel Events',
    price: 'Custom',
    description: 'Professional event coordination',
    icon: <CalendarPlus size={24} />,
    features: [
      'Event planning suite',
      'RSVP management',
      'Attendee coordination',
      'Venue management',
      'Ticketing integration',
      'Custom event page branding',
      'Custom backgrounds, fonts & colors',
      'Event analytics',
      'Dedicated support'
    ],
    cta: 'Contact Sales',
    ctaAction: () => window.location.href = 'mailto:christian@chravelapp.com?subject=Requesting%20a%20Chravel%20Demo',
    enterprise: true
  }
];


export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handlePlanSelect = (planId: string) => {
    console.log(`Selected plan: ${planId}`);
    // Handle plan selection logic
  };

  const getPlusPrice = () => {
    return billingCycle === 'monthly' ? `$${TRIPS_PLUS_PRICE}` : `$${TRIPS_PLUS_ANNUAL_PRICE}`;
  };

  const calculateSavings = () => {
    const monthlyCost = TRIPS_PLUS_PRICE * 12;
    const annualCost = TRIPS_PLUS_ANNUAL_PRICE;
    return Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
  };

  return (
    <div className="w-full space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">
          Choose your perfect plan
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          From personal trips to enterprise events, we have the right solution for your needs
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="relative w-12 h-6 bg-muted rounded-full transition-colors"
          >
            <div className={`absolute top-1 w-4 h-4 bg-primary rounded-full transition-transform ${
              billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
          <span className={`text-sm ${billingCycle === 'annual' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            Annual
          </span>
          {billingCycle === 'annual' && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              Save {calculateSavings()}%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingTiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`relative bg-card/80 backdrop-blur-sm border transition-all hover:scale-105 ${
              tier.popular 
                ? 'border-primary/50 shadow-lg' 
                : tier.enterprise 
                ? 'border-accent/50' 
                : 'border-border/50'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                tier.popular 
                  ? 'bg-primary/20 text-primary' 
                  : tier.enterprise 
                  ? 'bg-accent/20 text-accent' 
                  : 'bg-muted/50 text-muted-foreground'
              }`}>
                {tier.icon}
              </div>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-foreground">
                  {tier.id === 'plus' ? getPlusPrice() : tier.price}
                  {((tier.id === 'plus' && tier.price !== '$0') || (tier.price !== '$0' && tier.price !== 'Custom')) && (
                    <span className="text-lg text-muted-foreground font-normal">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>
                {tier.id === 'plus' && billingCycle === 'annual' && (
                  <div className="text-sm text-green-400 font-medium">
                    Save {calculateSavings()}%
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  tier.popular 
                    ? 'bg-primary hover:bg-primary/90' 
                    : tier.enterprise 
                    ? 'bg-accent hover:bg-accent/90' 
                    : 'bg-secondary hover:bg-secondary/90'
                }`}
                onClick={tier.ctaAction || (() => handlePlanSelect(tier.id))}
              >
                {tier.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Enterprise Contact */}
      <div className="text-center space-y-4 bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
        <Shield size={48} className="mx-auto text-accent" />
        <h3 className="text-2xl font-bold text-foreground">
          Need something custom?
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Looking for custom integrations or specialized features? Let's discuss how we can help.
        </p>
        <Button size="lg" variant="outline" className="border-accent/30 text-accent hover:bg-accent/10">
          Contact Enterprise Sales
        </Button>
      </div>
    </div>
  );
};