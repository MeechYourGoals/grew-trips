
import { PaymentMethod } from '../types/receipts';

export const generatePaymentDeeplink = (
  method: PaymentMethod,
  amount: number,
  recipientName: string
): string | null => {
  const formattedAmount = amount.toFixed(2);
  
  switch (method) {
    case 'venmo':
      // Venmo deeplink format
      return `venmo://paycharge?txn=pay&recipients=${encodeURIComponent(recipientName)}&amount=${formattedAmount}&note=${encodeURIComponent('Trip expense')}`;
    
    case 'cashapp':
      // Cash App deeplink format
      return `https://cash.app/$${encodeURIComponent(recipientName)}/${formattedAmount}`;
    
    case 'zelle':
      // Zelle doesn't have direct deeplinks, redirect to banking apps or web
      return `https://www.zellepay.com/send-money`;
    
    case 'paypal':
      // PayPal.Me deeplink format
      return `https://paypal.me/${encodeURIComponent(recipientName)}/${formattedAmount}`;
    
    case 'applecash':
      // Apple Cash is handled through iMessage, no direct web link
      return null;
    
    default:
      return null;
  }
};

export const getPaymentMethodDisplayName = (method: PaymentMethod): string => {
  switch (method) {
    case 'venmo':
      return 'Venmo';
    case 'cashapp':
      return 'Cash App';
    case 'zelle':
      return 'Zelle';
    case 'paypal':
      return 'PayPal';
    case 'applecash':
      return 'Apple Cash';
    default:
      return method;
  }
};
