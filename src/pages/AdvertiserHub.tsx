import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { AdvertiserDashboard } from '@/components/advertiser/AdvertiserDashboard';
import { AdvertiserOnboarding } from '@/components/advertiser/AdvertiserOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const AdvertiserHub = () => {
  const { user, isLoading } = useAuth();
  const [advertiserProfile, setAdvertiserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (user) {
      checkAdvertiserProfile();
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [user, isLoading]);

  const checkAdvertiserProfile = async () => {
    const timeoutId = setTimeout(() => {
      setError('Request timed out. Please try again.');
      setLoading(false);
    }, 10000); // 10 second timeout

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Checking advertiser profile for user:', user?.id);

      // Direct database query instead of edge function
      const { data, error } = await supabase
        .from('advertiser_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      clearTimeout(timeoutId);

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ Profile query result:', data);
      setAdvertiserProfile(data || null);
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Error checking advertiser profile:', error);
      setError(error.message || 'Failed to load advertiser profile');
      setAdvertiserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    checkAdvertiserProfile();
  };

  const handleProfileCreated = (profile: any) => {
    setAdvertiserProfile(profile);
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Loading Advertiser Hub...</p>
          <p className="text-sm text-muted-foreground/70">
            {retryCount > 0 && `Retry attempt ${retryCount}`}
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Unable to Load Advertiser Hub</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <div className="space-y-2">
            <Button onClick={handleRetry} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <p className="text-xs text-muted-foreground">
              If this persists, please contact support
            </p>
          </div>
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