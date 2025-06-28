
export interface Receipt {
  id: string;
  tripId: string;
  uploaderId: string;
  uploaderName: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  totalAmount: number;
  currency: string;
  preferredMethod: 'venmo' | 'splitwise' | 'cashapp' | 'zelle';
  splitCount?: number;
  perPersonAmount?: number;
  createdAt: string;
}

export interface ReceiptUpload {
  file: File;
  totalAmount: number;
  currency: string;
  preferredMethod: 'venmo' | 'splitwise' | 'cashapp' | 'zelle';
  splitCount?: number;
}

export type PaymentMethod = 'venmo' | 'splitwise' | 'cashapp' | 'zelle';
