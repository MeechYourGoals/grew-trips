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
import { Loader2 } from 'lucide-react';

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

  // Load trip members
  useEffect(() => {
    const loadMembers = async () => {
      const { data: membersData } = await supabase
        .from('trip_members')
        .select('user_id, profiles(display_name, avatar_url)')
        .eq('trip_id', tripId);

      if (membersData) {
        const formattedMembers = membersData.map(m => ({
          id: m.user_id,
          name: (m.profiles as any)?.display_name || 'Unknown',
          avatar: (m.profiles as any)?.avatar_url
        }));
        setTripMembers(formattedMembers);
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
      <PaymentInput
        onSubmit={handlePaymentSubmit}
        tripMembers={tripMembers}
        isVisible={true}
      />

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
