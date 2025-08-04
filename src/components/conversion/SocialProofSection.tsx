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
    name: "Sarah Chen",
    role: "Event Director",
    company: "SXSW",
    avatar: "SC",
    quote: "Chravel transformed how we coordinate our 400+ session festival. Cut our planning time by 60% and boosted attendee satisfaction scores to 4.8/5.",
    rating: 5,
    useCase: "Large Festival"
  },
  {
    name: "Marcus Rodriguez", 
    role: "Tour Manager",
    company: "Live Nation",
    avatar: "MR",
    quote: "Managing 50+ crew across 30 cities used to be chaos. Now it's seamless. The real-time updates and budget tracking alone saved us $45K last tour.",
    rating: 5,
    useCase: "Music Tour"
  },
  {
    name: "Emily Thompson",
    role: "Bachelorette Organizer",
    company: "Friend Group",
    avatar: "ET",
    quote: "Planned a 12-person Tulum trip in 2 hours instead of 2 weeks. Everyone stayed in the loop and we actually stayed on budget for once!",
    rating: 5,
    useCase: "Group Travel"
  }
];

const metrics: Metric[] = [
  { value: "2,847", label: "trips managed", icon: <MapPin size={16} />, trend: "+42% this month" },
  { value: "78%", label: "less coordination time", icon: <Clock size={16} /> },
  { value: "94%", label: "user satisfaction", icon: <Star size={16} /> },
  { value: "$2.3M", label: "budget savings tracked", icon: <TrendingUp size={16} />, trend: "across all users" }
];

const logos = ["SXSW", "Live Nation", "Goldman Sachs", "Tesla", "Y Combinator", "UCLA"];

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
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">Trusted by teams at</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {logos.map((logo, index) => (
            <div key={index} className="text-lg font-semibold text-muted-foreground">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};