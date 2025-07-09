import React from 'react';
import { MessageCircle } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <MessageCircle size={32} className="text-gray-600 mx-auto mb-2" />
      <p className="text-gray-500 text-sm">No messages yet</p>
    </div>
  );
};