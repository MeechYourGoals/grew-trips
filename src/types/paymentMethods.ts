export type PaymentMethodId = 'venmo' | 'splitwise' | 'cashapp' | 'zelle';

export interface PaymentMethodOption {
  id: PaymentMethodId;
  label: string;
}
