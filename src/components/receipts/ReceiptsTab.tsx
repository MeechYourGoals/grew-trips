
import React, { useState } from 'react';
import { Upload, Receipt as ReceiptIcon, Plus } from 'lucide-react';
import { ReceiptUploadModal } from './ReceiptUploadModal';
import { ReceiptCard } from './ReceiptCard';
import { Receipt } from '../../types/receipts';
import { useAuth } from '../../hooks/useAuth';

interface ReceiptsTabProps {
  tripId: string;
}

export const ReceiptsTab = ({ tripId }: ReceiptsTabProps) => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  // Mock receipts data for demo
  const mockReceipts: Receipt[] = [
    {
      id: '1',
      tripId,
      uploaderId: '1',
      uploaderName: 'Emma',
      fileUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop',
      fileName: 'Dinner at Le Comptoir.jpg',
      fileType: 'image/jpeg',
      totalAmount: 156.80,
      currency: 'USD',
      preferredMethod: 'venmo',
      splitCount: 4,
      perPersonAmount: 39.20,
      createdAt: '2025-01-15T19:30:00Z'
    },
    {
      id: '2',
      tripId,
      uploaderId: '2',
      uploaderName: 'Jake',
      fileUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      fileName: 'Grocery shopping.pdf',
      fileType: 'application/pdf',
      totalAmount: 87.45,
      currency: 'USD',
      preferredMethod: 'splitwise',
      splitCount: 6,
      perPersonAmount: 14.58,
      createdAt: '2025-01-14T10:15:00Z'
    }
  ];

  const handleReceiptUploaded = (newReceipt: Receipt) => {
    setReceipts(prev => [newReceipt, ...prev]);
    setShowUploadModal(false);
  };

  const displayReceipts = receipts.length > 0 ? receipts : mockReceipts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <ReceiptIcon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Trip Receipts</h3>
            <p className="text-gray-400 text-sm">Upload and split expenses with your group</p>
          </div>
        </div>
        
        {user && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 hover:from-green-600 hover:to-emerald-600"
          >
            <Plus size={16} />
            Add Receipt
          </button>
        )}
      </div>

      {/* Receipts List */}
      {displayReceipts.length > 0 ? (
        <div className="grid gap-4">
          {displayReceipts.map((receipt) => (
            <ReceiptCard key={receipt.id} receipt={receipt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-gray-500" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">No receipts yet</h4>
          <p className="text-gray-400 mb-6">Start by uploading your first trip expense</p>
          {user && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 mx-auto hover:from-green-600 hover:to-emerald-600"
            >
              <Plus size={16} />
              Upload Receipt
            </button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <ReceiptUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onReceiptUploaded={handleReceiptUploaded}
        tripId={tripId}
      />
    </div>
  );
};
