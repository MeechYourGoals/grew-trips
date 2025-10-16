import React, { useEffect, useState } from 'react';
import { BalanceSummary } from './BalanceSummary';
import { PersonBalanceCard } from './PersonBalanceCard';
import { PaymentHistory } from './PaymentHistory';
import { PaymentInput } from './PaymentInput';
import { paymentBalanceService, BalanceSummary as BalanceSummaryType } from '../../services/paymentBalanceService';
import { useAuth } from '../../hooks/useAuth';
import { usePayments } from '../../hooks/usePayments';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { getTripById } from '../../data/tripsData';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';

interface PaymentsTabProps {
  tripId: string;
}

export const PaymentsTab = ({ tripId }: PaymentsTabProps) => {
  const { user } = useAuth();
  const { createPaymentMessage } = usePayments(tripId);
  const { toast } = useToast();
  const [balanceSummary, setBalanceSummary] = useState<BalanceSummaryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripMembers, setTripMembers] = useState<Array<{ id: string; name: string; avatar?: string }>>([]);

  // Load trip members - use tripsData for consumer trips (1-12), DB for others
  useEffect(() => {
    const loadMembers = async () => {
      const tripIdNum = parseInt(tripId);
      
      // Consumer trips (1-12): use tripsData
      if (tripIdNum >= 1 && tripIdNum <= 12) {
        const trip = getTripById(tripIdNum);
        if (trip?.participants) {
          const formattedMembers = trip.participants.map(p => ({
            id: p.id.toString(),
            name: p.name,
            avatar: p.avatar
          }));
          setTripMembers(formattedMembers);
          return;
        }
      }
      
      // Other trips: two-step fetch to avoid RLS and FK issues
      try {
        // Step 1: Get user_ids from trip_members
        const { data: memberIds, error: memberError } = await supabase
          .from('trip_members')
          .select('user_id')
          .eq('trip_id', tripId);

        if (memberError || !memberIds || memberIds.length === 0) {
          console.warn('No trip members found or error:', memberError);
          setTripMembers([]);
          return;
        }

        const userIds = memberIds.map(m => m.user_id);

        // Step 2: Get profiles for those user_ids
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url')
          .in('user_id', userIds);

        if (profileError) {
          console.warn('Error fetching profiles:', profileError);
          setTripMembers([]);
          return;
        }

        const formattedMembers = (profiles || []).map(p => ({
          id: p.user_id,
          name: p.display_name || 'Unknown User',
          avatar: p.avatar_url || undefined
        }));

        setTripMembers(formattedMembers);
      } catch (error) {
        console.error('Error loading trip members:', error);
        setTripMembers([]);
      }
    };

    loadMembers();
  }, [tripId]);

  // Load balances
  useEffect(() => {
    const loadBalances = async () => {
      if (!user?.id) {
        setBalanceSummary({
          totalOwed: 0,
          totalOwedToYou: 0,
          netBalance: 0,
          balances: []
        });
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const summary = await paymentBalanceService.getBalanceSummary(tripId, user.id);
      setBalanceSummary(summary);
      setLoading(false);
    };

    loadBalances();
  }, [tripId, user?.id]);

  const handlePaymentSubmit = async (paymentData: {
    amount: number;
    currency: string;
    description: string;
    splitCount: number;
    splitParticipants: string[];
    paymentMethods: string[];
  }) => {
    const paymentId = await createPaymentMessage(paymentData);
    
    if (paymentId) {
      toast({
        title: "Payment request created",
        description: `${paymentData.description} - $${paymentData.amount}`,
      });
      
      // Refresh balance summary
      if (user?.id) {
        const summary = await paymentBalanceService.getBalanceSummary(tripId, user.id);
        setBalanceSummary(summary);
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to create payment request",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!balanceSummary) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Unable to load payment information
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Creation */}
      {!user ? (
        <div className="bg-card rounded-lg border border-border p-6 text-center">
          <LogIn className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sign in to create payment requests</h3>
          <p className="text-muted-foreground mb-4">
            You need to be signed in to create and manage payments for this trip.
          </p>
          <Button variant="default" onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      ) : (
        <PaymentInput
          onSubmit={handlePaymentSubmit}
          tripMembers={tripMembers}
          isVisible={true}
        />
      )}

      {/* Balance Summary Card */}
      <BalanceSummary summary={balanceSummary} />

      {/* Per-Person Balance Cards */}
      {balanceSummary.balances.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Balance Breakdown</h3>
          {balanceSummary.balances.map(balance => (
            <PersonBalanceCard 
              key={balance.userId} 
              balance={balance}
              tripId={tripId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/50 rounded-lg border border-border">
          <p className="text-muted-foreground">
            All settled up! No outstanding payments.
          </p>
        </div>
      )}

      {/* Payment History */}
      <PaymentHistory tripId={tripId} />
    </div>
  );
};
