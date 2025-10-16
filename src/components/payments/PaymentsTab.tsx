import React, { useEffect, useState } from 'react';
import { BalanceSummary } from './BalanceSummary';
import { PersonBalanceCard } from './PersonBalanceCard';
import { PaymentHistory } from './PaymentHistory';
import { paymentBalanceService, BalanceSummary as BalanceSummaryType } from '../../services/paymentBalanceService';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface PaymentsTabProps {
  tripId: string;
}

export const PaymentsTab = ({ tripId }: PaymentsTabProps) => {
  const { user } = useAuth();
  const [balanceSummary, setBalanceSummary] = useState<BalanceSummaryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBalances = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      const summary = await paymentBalanceService.getBalanceSummary(tripId, user.id);
      setBalanceSummary(summary);
      setLoading(false);
    };

    loadBalances();
  }, [tripId, user?.id]);

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
