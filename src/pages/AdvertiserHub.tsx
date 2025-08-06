import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { AdvertiserDashboard } from '@/components/advertiser/AdvertiserDashboard';
import { AdvertiserOnboarding } from '@/components/advertiser/AdvertiserOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AdvertiserHub = () => {
  const { user, isLoading } = useAuth();
  const [advertiserProfile, setAdvertiserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdvertiserProfile();
    }
  }, [user]);

  const checkAdvertiserProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

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
      setAdvertiserProfile(data.profile);
    } catch (error) {
      console.error('Error checking advertiser profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileCreated = (profile: any) => {
    setAdvertiserProfile(profile);
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Advertiser Hub...</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {advertiserProfile ? (
        <AdvertiserDashboard profile={advertiserProfile} onProfileUpdate={setAdvertiserProfile} />
      ) : (
        <AdvertiserOnboarding onProfileCreated={handleProfileCreated} />
      )}
    </div>
  );
};

export default AdvertiserHub;