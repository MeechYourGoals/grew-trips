
import { useState, useEffect, createContext, useContext } from 'react';
import { ConsumerSubscription } from '../types/consumer';
import { useAuth } from './useAuth';

interface ConsumerSubscriptionContextType {
  subscription: ConsumerSubscription | null;
  isPlus: boolean;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  upgradeToPlus: () => Promise<void>;
}

const ConsumerSubscriptionContext = createContext<ConsumerSubscriptionContextType | undefined>(undefined);

export const ConsumerSubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<ConsumerSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock subscription data - now defaulting to plus for all users
  const mockSubscription: ConsumerSubscription = {
    tier: 'plus', // Changed from 'free' to 'plus'
    status: 'active'
  };

  useEffect(() => {
    if (user) {
      setSubscription(mockSubscription);
    } else {
      setSubscription(mockSubscription); // Even non-authenticated users get plus access
    }
  }, [user]);

  const checkSubscription = async () => {
    setIsLoading(true);
    // TODO: Implement actual subscription check with Supabase/Stripe
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const upgradeToPlus = async () => {
    setIsLoading(true);
    // TODO: Implement Stripe checkout for Trips Plus
    console.log('Upgrading to Trips Plus...');
    setTimeout(() => {
      setSubscription(prev => prev ? { ...prev, tier: 'plus' } : null);
      setIsLoading(false);
    }, 2000);
  };

  const isPlus = true; // Always return true to remove paywall

  return (
    <ConsumerSubscriptionContext.Provider value={{
      subscription,
      isPlus,
      isLoading,
      checkSubscription,
      upgradeToPlus
    }}>
      {children}
    </ConsumerSubscriptionContext.Provider>
  );
};

export const useConsumerSubscription = () => {
  const context = useContext(ConsumerSubscriptionContext);
  if (context === undefined) {
    throw new Error('useConsumerSubscription must be used within a ConsumerSubscriptionProvider');
  }
  return context;
};
