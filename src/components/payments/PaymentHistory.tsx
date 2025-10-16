import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { supabase } from '../../integrations/supabase/client';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface PaymentHistoryProps {
  tripId: string;
}

interface PaymentRecord {
  id: string;
  description: string;
  amount: number;
  currency: string;
  splitCount: number;
  createdBy: string;
  createdAt: string;
  createdByName?: string;
}

export const PaymentHistory = ({ tripId }: PaymentHistoryProps) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('trip_payment_messages')
        .select(`
          *,
          profiles!trip_payment_messages_created_by_fkey(display_name)
        `)
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setPayments(data.map(p => ({
          id: p.id,
          description: p.description,
          amount: p.amount,
          currency: p.currency,
          splitCount: p.split_count,
          createdBy: p.created_by,
          createdAt: p.created_at,
          createdByName: (p.profiles as any)?.display_name
        })));
      }

      setLoading(false);
    };

    loadPayments();
  }, [tripId]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{payment.description}</p>
                  <p className="text-sm text-muted-foreground">
                    By {payment.createdByName || 'Unknown'} • Split {payment.splitCount} ways • {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatCurrency(payment.amount, payment.currency)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(payment.amount / payment.splitCount, payment.currency)}/person
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No payments yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};
