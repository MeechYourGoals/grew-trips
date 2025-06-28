
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
    
    case 'splitwise':
      // Splitwise web app
      return `https://secure.splitwise.com/`;
    
    default:
      return null;
  }
};

export const getPaymentMethodDisplayName = (method: PaymentMethod): string => {
  switch (method) {
    case 'venmo':
      return 'Venmo';
    case 'splitwise':
      return 'Splitwise';
    case 'cashapp':
      return 'Cash App';
    case 'zelle':
      return 'Zelle';
    default:
      return method;
  }
};
