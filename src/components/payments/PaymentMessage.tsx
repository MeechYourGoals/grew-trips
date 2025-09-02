import React, { useState } from 'react';
import { DollarSign, Users, CreditCard, Clock, Check } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PaymentMessage as PaymentMessageType, PaymentMethod } from '../../types/payments';

interface PaymentMessageProps {
  payment: PaymentMessageType;
  currentUserId: string;
  tripMembers: Array<{ id: string; name: string; avatar?: string }>;
  userPaymentMethods: PaymentMethod[];
  onSettlePayment?: (paymentId: string, method: string) => void;
}

export const PaymentMessage = ({ 
  payment, 
  currentUserId, 
  tripMembers, 
  userPaymentMethods,
  onSettlePayment 
}: PaymentMessageProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const isPaidByCurrentUser = payment.createdBy === currentUserId;
  const amountPerPerson = payment.amount / payment.splitCount;
  const payer = tripMembers.find(member => member.id === payment.createdBy);
  
  // Remove icon function - we'll just use text labels

  const getPaymentMethodName = (method: string) => {
    const names: Record<string, string> = {
      venmo: 'Venmo',
      zelle: 'Zelle',
      cashapp: 'Cash App', 
      applepay: 'Apple Pay',
      paypal: 'PayPal',
      cash: 'Cash',
      other: 'Other'
    };
    return names[method] || method;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="bg-payment-background-light border-payment-border dark:bg-payment-background dark:border-payment-border">
      <CardContent className="p-4">
        {/* Payment Header */}
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={18} className="text-payment-primary" />
          <Badge variant="secondary" className="bg-payment-primary text-payment-primary-foreground">
            💳 PAYMENT
          </Badge>
          <span className="text-xs text-muted-foreground ml-auto">
            {formatTime(payment.createdAt)}
          </span>
        </div>

        {/* Payment Summary */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-lg text-foreground">
                {formatCurrency(payment.amount, payment.currency)}
              </h4>
              <p className="text-sm text-muted-foreground">{payment.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Split {payment.splitCount} ways</div>
              <div className="font-medium text-payment-primary">
                {formatCurrency(amountPerPerson, payment.currency)} per person
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={14} />
            <span>Paid by {payer?.name || 'Unknown'}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-2">Preferred payment methods:</div>
          <div className="flex flex-wrap gap-1">
            {payment.paymentMethods.map(method => (
              <Badge key={method} variant="outline" className="text-xs">
                {getPaymentMethodName(method)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </Button>

          {!isPaidByCurrentUser && (
            <Button
              size="sm"
              className="bg-payment-primary hover:bg-payment-primary/90 text-payment-primary-foreground"
              onClick={() => {
                const preferredMethod = userPaymentMethods.find(m => m.isPreferred)?.type || 'venmo';
                onSettlePayment?.(payment.id, preferredMethod);
              }}
            >
              <Check size={14} className="mr-1" />
              Mark Paid
            </Button>
          )}
        </div>

        {/* Detailed View */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-payment-border">
            <div className="space-y-3">
              {/* Who Owes What */}
              <div>
                <h5 className="font-medium text-sm mb-2">Split breakdown:</h5>
                <div className="space-y-1">
                  {payment.splitParticipants.map(participantId => {
                    const participant = tripMembers.find(m => m.id === participantId);
                    const isCurrentUser = participantId === currentUserId;
                    const isPayer = participantId === payment.createdBy;
                    
                    return (
                      <div key={participantId} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {participant?.avatar && (
                            <img 
                              src={participant.avatar} 
                              alt={participant.name}
                              className="w-5 h-5 rounded-full"
                            />
                          )}
                          <span className={isCurrentUser ? 'font-medium' : ''}>
                            {isCurrentUser ? 'You' : participant?.name || 'Unknown'}
                            {isPayer && ' (paid)'}
                          </span>
                        </div>
                        <span className={isPayer ? 'text-payment-primary' : 'text-orange-600'}>
                          {isPayer ? '+' : '-'}{formatCurrency(amountPerPerson, payment.currency)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Your Payment Options (if you owe money) */}
              {!isPaidByCurrentUser && (
                <div>
                  <h5 className="font-medium text-sm mb-2">Pay {payer?.name}:</h5>
                  <div className="space-y-1">
                    {payment.paymentMethods.map(method => (
                      <Button
                        key={method}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          // Would open payment app or copy payment info
                          console.log(`Pay via ${method}`);
                        }}
                      >
                        Pay via {getPaymentMethodName(method)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};