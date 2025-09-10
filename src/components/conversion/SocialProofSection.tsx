import React from 'react';
import { Star, Users, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  useCase: string;
}

interface Metric {
  value: string;
  label: string;
  icon: React.ReactNode;
  trend?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Paul George",
    role: "AAU Travel Coach",
    company: "Elite AAU team",
    avatar: "PG",
    quote: "This looks like the app we didn't know we needed. Please, please let us know once this is live. It would be so helpful for our team as well as AAU teams across the country.",
    rating: 5,
    useCase: "Youth Sports"
  },
  {
    name: "Chris Burns", 
    role: "Promoter",
    company: "Live Nation",
    avatar: "CB",
    quote: "Managing double-digit people crews across the country always comes with a bit of chaos, but travel app looks poised to alleviate the headaches of thousands of artists.",
    rating: 5,
    useCase: "Music Tour"
  },
  {
    name: "Carla Santiago",
    role: "Mom, family trip planner",
    company: "Family Vacation",
    avatar: "CS",
    quote: "As a mom, planning and organizing the family trips is draining and often overwhelming. I have needed something like Chravel for years and can't wait for the launch.",
    rating: 5,
    useCase: "Group Travel"
  }
];

const metrics: Metric[] = [
  { value: "Instantly See", label: "Itinerary Conflicts", icon: <MapPin size={16} />, trend: "Automatically flags double-bookings before they happen" },
  { value: "Automated", label: "Payment Tracking", icon: <Clock size={16} />, trend: "See who's paid and who hasn't, all in one place" },
  { value: "Real-Time", label: "Updates", icon: <Star size={16} />, trend: "Everyone gets instant alerts when plans change" },
  { value: "Proven for", label: "Complex Travel", icon: <TrendingUp size={16} />, trend: "Successfully handles sports teams, tours, and family reunions" }
];

interface OrganizationLogo {
  name: string;
  logoComponent: React.ReactNode;
  altText: string;
}

const organizationLogos: OrganizationLogo[] = [
  {
    name: "Invest Fest",
    altText: "Invest Fest by Earn Your Leisure",
    logoComponent: (
      <svg className="h-10 w-auto" viewBox="0 0 120 40" fill="none">
        <rect x="0" y="0" width="120" height="40" rx="8" fill="currentColor" opacity="0.1"/>
        <text x="60" y="25" textAnchor="middle" className="text-sm font-bold fill-current">
          INVEST FEST
        </text>
      </svg>
    )
  },
  {
    name: "Live Nation",
    altText: "Live Nation Entertainment",
    logoComponent: (
      <svg className="h-10 w-auto" viewBox="0 0 100 40" fill="none">
        <rect x="0" y="0" width="100" height="40" rx="6" fill="currentColor" opacity="0.1"/>
        <text x="50" y="25" textAnchor="middle" className="text-sm font-bold fill-current">
          LIVE NATION
        </text>
      </svg>
    )
  },
  {
    name: "Philadelphia 76ers",
    altText: "Philadelphia 76ers",
    logoComponent: (
      <svg className="h-10 w-auto" viewBox="0 0 80 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.1"/>
        <text x="20" y="26" textAnchor="middle" className="text-lg font-bold fill-current">
          76ERS
        </text>
        <text x="65" y="25" textAnchor="middle" className="text-xs font-medium fill-current opacity-60">
          NBA
        </text>
      </svg>
    )
  },
  {
    name: "University of North Carolina",
    altText: "University of North Carolina Men's Lacrosse",
    logoComponent: (
      <svg className="h-10 w-auto" viewBox="0 0 80 40" fill="none">
        <rect x="0" y="0" width="80" height="40" rx="6" fill="currentColor" opacity="0.1"/>
        <text x="40" y="25" textAnchor="middle" className="text-lg font-bold fill-current">
          UNC
        </text>
      </svg>
    )
  },
  {
    name: "Los Angeles Chargers",
    altText: "Los Angeles Chargers",
    logoComponent: (
      <svg className="h-10 w-auto" viewBox="0 0 100 40" fill="none">
        <path d="M10 20 L30 10 L25 20 L30 30 Z" fill="currentColor" opacity="0.2"/>
        <text x="60" y="25" textAnchor="middle" className="text-sm font-bold fill-current">
          CHARGERS
        </text>
      </svg>
    )
  },
  {
    name: "Goodwin Law",
    altText: "Goodwin Procter LLP",
    logoComponent: (
      <svg className="h-10 w-auto" viewBox="0 0 110 40" fill="none">
        <rect x="0" y="0" width="110" height="40" rx="4" fill="currentColor" opacity="0.05"/>
        <text x="55" y="25" textAnchor="middle" className="text-sm font-medium fill-current">
          GOODWIN LAW
        </text>
      </svg>
    )
  },
  {
    name: "Major Talent Agencies",
    altText: "Managers and Touring Clients of Major Talent Agencies",
    logoComponent: (
      <svg className="h-10 w-auto" viewBox="0 0 140 40" fill="none">
        <rect x="0" y="0" width="140" height="40" rx="6" fill="currentColor" opacity="0.1"/>
        <text x="70" y="18" textAnchor="middle" className="text-xs font-medium fill-current">
          MAJOR TALENT
        </text>
        <text x="70" y="30" textAnchor="middle" className="text-xs font-medium fill-current">
          AGENCIES
        </text>
      </svg>
    )
  }
];

export const SocialProofSection = () => {
  return (
    <div className="w-full space-y-8">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2 text-primary">
                {metric.icon}
              </div>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
              {metric.trend && (
                <div className="text-xs text-accent mt-1">{metric.trend}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Testimonials Carousel */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-foreground">
          Trusted by travelers and professionals worldwide
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-accent">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <Badge variant="outline" className="text-xs">
                  {testimonial.useCase}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Logo Bar */}
      <div className="text-center space-y-6">
        <p className="text-sm text-muted-foreground">Anticipated by and wait list interest from teams at</p>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12 opacity-70 hover:opacity-90 transition-opacity">
          {organizationLogos.map((org, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200 grayscale hover:grayscale-0"
              title={org.altText}
            >
              {org.logoComponent}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};