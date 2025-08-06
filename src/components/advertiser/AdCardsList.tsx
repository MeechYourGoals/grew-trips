import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ImageIcon, ExternalLink, MapPin, Eye, MousePointer, Edit, Pause, Play } from 'lucide-react';

interface AdCardsListProps {
  adCards: any[];
  campaigns: any[];
  onAdCardsChange: (adCards: any[]) => void;
}

export const AdCardsList = ({ adCards, campaigns, onAdCardsChange }: AdCardsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500 hover:bg-green-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'rejected':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hotel':
        return 'bg-blue-100 text-blue-800';
      case 'restaurant':
        return 'bg-orange-100 text-orange-800';
      case 'activity':
        return 'bg-green-100 text-green-800';
      case 'tour':
        return 'bg-purple-100 text-purple-800';
      case 'experience':
        return 'bg-pink-100 text-pink-800';
      case 'transportation':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (adCards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Ad Cards</CardTitle>
          <CardDescription>
            Create and manage promotional cards for your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No ad cards yet</h3>
            <p className="text-muted-foreground mb-6">
              Create promotional cards to showcase your business in Chravel recommendations
            </p>
            <Button disabled={campaigns.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              {campaigns.length === 0 ? 'Create a campaign first' : 'Create Your First Ad Card'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Ad Cards</h2>
          <p className="text-muted-foreground">
            {adCards.length} ad card{adCards.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button disabled={campaigns.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          {campaigns.length === 0 ? 'Create a campaign first' : 'New Ad Card'}
        </Button>
      </div>

      <div className="grid gap-4">
        {adCards.map((adCard) => (
          <Card key={adCard.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Image */}
                <div className="flex-shrink-0">
                  {adCard.image_url ? (
                    <img
                      src={adCard.image_url}
                      alt={adCard.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg truncate">{adCard.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{adCard.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge className={getStatusColor(adCard.moderation_status)}>
                        {adCard.moderation_status.charAt(0).toUpperCase() + adCard.moderation_status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className={getCategoryColor(adCard.category)}>
                      {adCard.category.charAt(0).toUpperCase() + adCard.category.slice(1)}
                    </Badge>
                    {adCard.location_city && (
                      <Badge variant="outline" className="text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {adCard.location_city}
                      </Badge>
                    )}
                    {adCard.tags?.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {adCard.impressions.toLocaleString()} impressions
                      </div>
                      <div className="flex items-center gap-1">
                        <MousePointer className="w-4 h-4" />
                        {adCard.clicks.toLocaleString()} clicks
                      </div>
                      <div className="flex items-center gap-1">
                        <ExternalLink className="w-4 h-4" />
                        CTR: {adCard.impressions > 0 
                          ? ((adCard.clicks / adCard.impressions) * 100).toFixed(2)
                          : '0.00'
                        }%
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};