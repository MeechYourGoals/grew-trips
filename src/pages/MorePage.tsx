
import React from 'react';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  Camera, 
  FileText, 
  Gift, 
  Star,
  MessageCircle,
  TrendingUp,
  Archive
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';

const MorePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: 'AI Concierge',
      description: 'Get personalized trip recommendations',
      badge: 'Pro',
      color: 'text-yellow-400',
      action: () => navigate('/ai/concierge')
    },
    {
      icon: TrendingUp,
      title: 'Review Analysis',
      description: 'AI-powered trip insights and sentiment analysis',
      badge: 'AI',
      color: 'text-blue-400',
      action: () => navigate('/ai/review-analysis')
    },
    {
      icon: MessageCircle,
      title: 'Audio Overviews',
      description: 'Listen to AI-generated trip summaries',
      badge: 'New',
      color: 'text-green-400',
      action: () => navigate('/ai/audio-overviews')
    },
    {
      icon: Calendar,
      title: 'Scheduled Messages',
      description: 'Manage automated trip communications',
      badge: 'Pro',
      color: 'text-purple-400',
      action: () => navigate('/admin/scheduled-messages')
    },
    {
      icon: Archive,
      title: 'Trip Archive',
      description: 'View and manage completed trips',
      color: 'text-gray-400',
      action: () => navigate('/archive')
    },
    {
      icon: Camera,
      title: 'Photo Memories',
      description: 'Create and share trip photo albums',
      color: 'text-pink-400',
      action: () => {}
    },
    {
      icon: Users,
      title: 'Find Friends',
      description: 'Connect with other travelers',
      color: 'text-indigo-400',
      action: () => {}
    },
    {
      icon: FileText,
      title: 'Trip Templates',
      description: 'Use pre-built trip planning templates',
      color: 'text-orange-400',
      action: () => {}
    },
    {
      icon: Gift,
      title: 'Referral Program',
      description: 'Invite friends and earn rewards',
      color: 'text-red-400',
      action: () => {}
    },
    {
      icon: Star,
      title: 'Rate App',
      description: 'Help us improve with your feedback',
      color: 'text-yellow-400',
      action: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">More Features</h1>
        <p className="text-gray-400">Discover all the ways Ravel can enhance your travels</p>
      </div>

      {/* Featured Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">AI-Powered Tools</h2>
        <div className="grid gap-4">
          {features.filter(f => f.badge === 'AI' || f.badge === 'Pro').map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
                <CardContent className="p-4" onClick={feature.action}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-gray-800 ${feature.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{feature.title}</h3>
                        {feature.badge && (
                          <Badge className={`text-xs ${
                            feature.badge === 'Pro' ? 'bg-yellow-500/20 text-yellow-400' :
                            feature.badge === 'AI' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All Features Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">All Features</h2>
        <div className="grid grid-cols-2 gap-4">
          {features.filter(f => !f.badge || (f.badge !== 'AI' && f.badge !== 'Pro')).map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-24 flex-col gap-2 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50"
                onClick={feature.action}
              >
                <Icon size={20} className={feature.color} />
                <span className="text-xs text-center">{feature.title}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-12">
        <p>More features coming soon!</p>
        <p>Have a suggestion? Contact support.</p>
      </div>
    </div>
  );
};

export default MorePage;
