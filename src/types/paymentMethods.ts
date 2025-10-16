export type PaymentMethodId = 'venmo' | 'cashapp' | 'zelle' | 'paypal' | 'applecash';

export interface PaymentMethodOption {
  id: PaymentMethodId;
  label: string;
}
