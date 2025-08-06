import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Calendar,
  Settings,
  BarChart3,
  ImageIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CreateCampaignModal } from './CreateCampaignModal';
import { CampaignsList } from './CampaignsList';
import { AdCardsList } from './AdCardsList';
import { AdvertiserProfile } from './AdvertiserProfile';

interface AdvertiserDashboardProps {
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

export const AdvertiserDashboard = ({ profile, onProfileUpdate }: AdvertiserDashboardProps) => {
  const [campaigns, setCampaigns] = useState([]);
  const [adCards, setAdCards] = useState([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalImpressions: 0,
    totalClicks: 0,
    averageCTR: 0
  });
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCampaigns(),
        loadAdCards(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('advertiser-management', {
        method: 'POST',
        body: { action: 'get-campaigns' }
      });

      if (error) {
        throw error;
      }

      setCampaigns(data?.campaigns || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setCampaigns([]);
    }
  };

  const loadAdCards = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('advertiser-management', {
        method: 'POST',
        body: { action: 'get-ad-cards' }
      });

      if (error) {
        throw error;
      }

      setAdCards(data?.ad_cards || []);
    } catch (error) {
      console.error('Error loading ad cards:', error);
      setAdCards([]);
    }
  };

  const loadStats = async () => {
    // Calculate stats from campaigns and ad cards
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length;
    const totalImpressions = adCards.reduce((sum: number, card: any) => sum + (card.impressions || 0), 0);
    const totalClicks = adCards.reduce((sum: number, card: any) => sum + (card.clicks || 0), 0);
    const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    setStats({
      totalCampaigns,
      activeCampaigns,
      totalImpressions,
      totalClicks,
      averageCTR
    });
  };

  const handleCampaignCreated = (newCampaign: any) => {
    setCampaigns(prev => [newCampaign, ...prev]);
    setShowCreateCampaign(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Advertiser Hub</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile.company_name}
          </p>
        </div>
        <Button onClick={() => setShowCreateCampaign(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create New Promotion
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageCTR.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="ad-cards">Ad Cards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <CampaignsList 
            campaigns={campaigns} 
            onCampaignsChange={setCampaigns}
            onCreateCampaign={() => setShowCreateCampaign(true)}
          />
        </TabsContent>

        <TabsContent value="ad-cards">
          <AdCardsList 
            adCards={adCards} 
            campaigns={campaigns}
            onAdCardsChange={setAdCards}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Detailed insights into your campaign performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Advanced analytics dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <AdvertiserProfile 
            profile={profile} 
            onProfileUpdate={onProfileUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <CreateCampaignModal
          isOpen={showCreateCampaign}
          onClose={() => setShowCreateCampaign(false)}
          onCampaignCreated={handleCampaignCreated}
        />
      )}
    </div>
  );
};