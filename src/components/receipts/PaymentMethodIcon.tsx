
import React from 'react';
import { DollarSign, CreditCard, Smartphone, Zap } from 'lucide-react';
import { PaymentMethod } from '../../types/receipts';

interface PaymentMethodIconProps {
  method: PaymentMethod;
  size?: number;
}

export const PaymentMethodIcon = ({ method, size = 20 }: PaymentMethodIconProps) => {
  const iconProps = { size, className: getIconColor(method) };

  switch (method) {
    case 'venmo':
      return <Smartphone {...iconProps} />;
    case 'splitwise':
      return <CreditCard {...iconProps} />;
    case 'cashapp':
      return <DollarSign {...iconProps} />;
    case 'zelle':
      return <Zap {...iconProps} />;
    default:
      return <DollarSign {...iconProps} />;
  }
};

const getIconColor = (method: PaymentMethod): string => {
  switch (method) {
    case 'venmo':
      return 'text-blue-400';
    case 'splitwise':
      return 'text-green-400';
    case 'cashapp':
      return 'text-emerald-400';
    case 'zelle':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
};
