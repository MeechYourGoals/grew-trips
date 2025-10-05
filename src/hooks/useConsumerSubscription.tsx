
import { useState, useEffect, createContext, useContext } from 'react';
import { ConsumerSubscription } from '../types/consumer';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_PRODUCTS } from '@/constants/stripe';
import { toast } from 'sonner';

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

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;

      const { subscribed, product_id, subscription_end } = data;
      
      // Check if user has Consumer Plus
      const isConsumerPlus = product_id === STRIPE_PRODUCTS['consumer-plus'].product_id;
      
      setSubscription({
        tier: isConsumerPlus ? 'plus' : 'free',
        status: subscribed ? 'active' : 'expired',
        subscriptionEndsAt: subscription_end,
        stripeCustomerId: data.stripe_customer_id,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription({ tier: 'free', status: 'expired' });
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeToPlus = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier: 'consumer-plus' }
      });
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const isPlus = subscription?.tier === 'plus' && subscription?.status === 'active';

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
