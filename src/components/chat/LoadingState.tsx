import React from 'react';
import { MessageCircle } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <MessageCircle size={48} className="text-blue-400 mx-auto mb-4 animate-pulse" />
        <h4 className="text-lg font-medium text-gray-300 mb-2">Loading Chat...</h4>
        <p className="text-gray-500 text-sm">Setting up messages</p>
      </div>
    </div>
  );
};