import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, DollarSign, TrendingUp, Eye, MousePointer } from 'lucide-react';
import { format } from 'date-fns';

interface CampaignsListProps {
  campaigns: any[];
  onCampaignsChange: (campaigns: any[]) => void;
  onCreateCampaign: () => void;
}

export const CampaignsList = ({ campaigns, onCampaignsChange, onCreateCampaign }: CampaignsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 hover:bg-green-600';
      case 'paused':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'completed':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'pending':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'rejected':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Campaigns</CardTitle>
          <CardDescription>
            Create and manage your advertising campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first advertising campaign
            </p>
            <Button onClick={onCreateCampaign}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Campaign
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
          <h2 className="text-2xl font-bold">Your Campaigns</h2>
          <p className="text-muted-foreground">
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={onCreateCampaign}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {campaign.start_date ? format(new Date(campaign.start_date), 'MMM dd') : 'No start date'} - 
                      {campaign.end_date ? format(new Date(campaign.end_date), 'MMM dd, yyyy') : 'No end date'}
                    </div>
                    {campaign.budget_amount && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${parseFloat(campaign.budget_amount).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{campaign.total_impressions.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" />
                    Impressions
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{campaign.total_clicks.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <MousePointer className="w-3 h-3" />
                    Clicks
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {campaign.total_impressions > 0 
                      ? ((campaign.total_clicks / campaign.total_impressions) * 100).toFixed(2)
                      : '0.00'
                    }%
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    CTR
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                {campaign.status === 'active' ? (
                  <Button variant="outline" size="sm">
                    Pause
                  </Button>
                ) : campaign.status === 'paused' ? (
                  <Button variant="outline" size="sm">
                    Resume
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};