import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { PersonalBalance } from '../../services/paymentBalanceService';
import { SettlePaymentDialog } from './SettlePaymentDialog';

interface PersonBalanceCardProps {
  balance: PersonalBalance;
  tripId: string;
}

export const PersonBalanceCard = ({ balance, tripId }: PersonBalanceCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showSettleDialog, setShowSettleDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const youOweThem = balance.amountOwed < 0;
  const amount = Math.abs(balance.amountOwed);

  const getPaymentMethodDisplay = () => {
    if (!balance.preferredPaymentMethod) return 'No payment method set';
    
    const method = balance.preferredPaymentMethod;
    const typeNames: Record<string, string> = {
      venmo: 'Venmo',
      cashapp: 'Cash App',
      zelle: 'Zelle',
      paypal: 'PayPal',
      applecash: 'Apple Cash'
    };

    return `${typeNames[method.type] || method.type}: ${method.identifier}`;
  };

  const getPaymentLink = () => {
    if (!balance.preferredPaymentMethod) return null;
    
    const method = balance.preferredPaymentMethod;
    const identifier = method.identifier;
    
    switch (method.type) {
      case 'venmo':
        return `venmo://paycharge?txn=pay&recipients=${encodeURIComponent(identifier)}&amount=${amount.toFixed(2)}`;
      case 'cashapp':
        return `https://cash.app/${encodeURIComponent(identifier)}/${amount.toFixed(2)}`;
      case 'paypal':
        return `https://paypal.me/${encodeURIComponent(identifier)}/${amount.toFixed(2)}`;
      case 'zelle':
        return null; // Zelle doesn't have direct deeplinks
      case 'applecash':
        return null; // Apple Cash handled through iMessage
      default:
        return null;
    }
  };

  const paymentLink = getPaymentLink();

  return (
    <>
      <Card className={youOweThem ? 'border-orange-600/30' : 'border-green-600/30'}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="w-12 h-12">
                <AvatarImage src={balance.avatar} alt={balance.userName} />
                <AvatarFallback>{balance.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{balance.userName}</h4>
                <p className="text-sm text-muted-foreground">
                  {getPaymentMethodDisplay()}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <p className={`text-2xl font-bold ${youOweThem ? 'text-orange-600' : 'text-green-600'}`}>
                {youOweThem ? 'You owe' : 'Owes you'}
              </p>
              <p className="text-xl font-semibold">{formatCurrency(amount)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {youOweThem ? (
              <>
                {paymentLink && (
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(paymentLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Pay Now
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowSettleDialog(true)}
                >
                  Mark as Settled
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1"
                onClick={() => setShowSettleDialog(true)}
              >
                Mark as Paid
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Details Section */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <h5 className="font-medium text-sm text-muted-foreground mb-2">
                Individual Payments
              </h5>
              {balance.unsettledPayments.length > 0 ? (
                balance.unsettledPayments.map((payment, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{payment.description}</span>
                    <span className={payment.amount < 0 ? 'text-orange-600' : 'text-green-600'}>
                      {formatCurrency(Math.abs(payment.amount))}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No itemized breakdown available
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <SettlePaymentDialog
        open={showSettleDialog}
        onOpenChange={setShowSettleDialog}
        balance={balance}
        tripId={tripId}
      />
    </>
  );
};
