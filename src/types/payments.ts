export interface PaymentMethod {
  id: string;
  type: 'venmo' | 'zelle' | 'cashapp' | 'applepay' | 'paypal' | 'cash' | 'other';
  identifier: string; // username, email, phone, etc.
  displayName?: string; // custom display name
  isPreferred?: boolean;
  isVisible?: boolean; // whether to show to trip members
}

export interface PaymentMessage {
  id: string;
  tripId: string;
  messageId: string;
  amount: number;
  currency: string;
  description: string;
  splitCount: number;
  splitParticipants: string[]; // user IDs
  paymentMethods: string[]; // payment method types
  createdBy: string;
  createdAt: string;
  isSettled?: boolean;
}

export interface PaymentSplit {
  id: string;
  paymentMessageId: string;
  debtorUserId: string;
  amountOwed: number;
  isSettled: boolean;
  settledAt?: string;
  settlementMethod?: string;
}

export interface UserPaymentMethods {
  userId: string;
  methods: PaymentMethod[];
}

export interface PaymentSettlement {
  from: string;
  to: string;
  amount: number;
  description: string;
  paymentMethods: string[];
}