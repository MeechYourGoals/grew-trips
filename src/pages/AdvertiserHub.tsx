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
      const { data, error } = await supabase.functions.invoke('advertiser-management', {
        method: 'POST',
        body: { action: 'get-profile' }
      });

      if (error) {
        throw error;
      }

      setAdvertiserProfile(data?.profile || null);
    } catch (error) {
      console.error('Error checking advertiser profile:', error);
      setAdvertiserProfile(null);
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