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
  ImageIcon,
  Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CreateCampaignModal } from './advertiser/CreateCampaignModal';
import { CampaignsList } from './advertiser/CampaignsList';
import { AdCardsList } from './advertiser/AdCardsList';
import { AdvertiserProfile } from './advertiser/AdvertiserProfile';
import { AdvertiserOnboarding } from './advertiser/AdvertiserOnboarding';

interface AdvertiserSettingsProps {
  currentUserId: string;
}

export const AdvertiserSettings = ({ currentUserId }: AdvertiserSettingsProps) => {
  const { user } = useAuth();
  const [advertiserProfile, setAdvertiserProfile] = useState(null);
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
    if (user) {
      checkAdvertiserProfile();
    }
  }, [user]);

  const checkAdvertiserProfile = async () => {
    try {
      console.log('Checking advertiser profile...');
      
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      // Make direct fetch call with action as URL parameter
      const url = new URL(`https://jmjiyekmxwsxkfnqwyaa.supabase.co/functions/v1/advertiser-management`);
      url.searchParams.append('action', 'get-profile');
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptaml5ZWtteHdzeGtmbnF3eWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjEwMDgsImV4cCI6MjA2OTQ5NzAwOH0.SAas0HWvteb9TbYNJFDf8Itt8mIsDtKOK6QwBcwINhI'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Profile check response:', data);
      
      setAdvertiserProfile(data?.profile || null);
      
      if (data?.profile) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Error checking advertiser profile:', error);
      setAdvertiserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        loadCampaigns(),
        loadAdCards()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      console.log('Loading campaigns...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const url = new URL(`https://jmjiyekmxwsxkfnqwyaa.supabase.co/functions/v1/advertiser-management`);
      url.searchParams.append('action', 'get-campaigns');
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptaml5ZWtteHdzeGtmbnF3eWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjEwMDgsImV4cCI6MjA2OTQ5NzAwOH0.SAas0HWvteb9TbYNJFDf8Itt8mIsDtKOK6QwBcwINhI'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Campaigns response:', data);
      setCampaigns(data?.campaigns || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setCampaigns([]);
    }
  };

  const loadAdCards = async () => {
    try {
      console.log('Loading ad cards...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const url = new URL(`https://jmjiyekmxwsxkfnqwyaa.supabase.co/functions/v1/advertiser-management`);
      url.searchParams.append('action', 'get-ad-cards');
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptaml5ZWtteHdzeGtmbnF3eWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MjEwMDgsImV4cCI6MjA2OTQ5NzAwOH0.SAas0HWvteb9TbYNJFDf8Itt8mIsDtKOK6QwBcwINhI'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Ad cards response:', data);
      setAdCards(data?.ad_cards || []);
    } catch (error) {
      console.error('Error loading ad cards:', error);
      setAdCards([]);
    }
  };

  const handleProfileCreated = (profile: any) => {
    setAdvertiserProfile(profile);
  };

  const handleCampaignCreated = (newCampaign: any) => {
    setCampaigns(prev => [newCampaign, ...prev]);
    setShowCreateCampaign(false);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400">Loading advertiser dashboard...</p>
      </div>
    );
  }

  // Show onboarding if no advertiser profile exists
  if (!advertiserProfile) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Building2 className="w-12 h-12 mx-auto text-blue-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Advertiser Hub</h2>
            <p className="text-gray-400">
              Create promotional cards for Chravel recommendations
            </p>
          </div>
          
          <AdvertiserOnboarding onProfileCreated={handleProfileCreated} />
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length;
  const totalImpressions = adCards.reduce((sum: number, card: any) => sum + (card.impressions || 0), 0);
  const totalClicks = adCards.reduce((sum: number, card: any) => sum + (card.clicks || 0), 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Advertiser Hub</h2>
            <p className="text-gray-400">
              Welcome back, {advertiserProfile.company_name}
            </p>
          </div>
          <Button onClick={() => setShowCreateCampaign(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Promotion
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Campaigns</p>
                  <p className="text-lg font-bold text-white">{totalCampaigns}</p>
                </div>
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Active</p>
                  <p className="text-lg font-bold text-green-400">{activeCampaigns}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Impressions</p>
                  <p className="text-lg font-bold text-white">{totalImpressions.toLocaleString()}</p>
                </div>
                <Eye className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Clicks</p>
                  <p className="text-lg font-bold text-white">{totalClicks.toLocaleString()}</p>
                </div>
                <MousePointer className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">CTR</p>
                  <p className="text-lg font-bold text-white">{averageCTR.toFixed(2)}%</p>
                </div>
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="ad-cards" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Ad Cards
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white/20 data-[state=active]:text-white">
              Profile
            </TabsTrigger>
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

          <TabsContent value="profile">
            <AdvertiserProfile 
              profile={advertiserProfile} 
              onProfileUpdate={setAdvertiserProfile}
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
    </div>
  );
};