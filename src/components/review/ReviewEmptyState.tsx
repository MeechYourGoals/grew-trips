
import React from 'react';
import { Globe } from 'lucide-react';

export const ReviewEmptyState = () => {
  return (
    <div className="text-center py-20">
      <Globe size={48} className="text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400">Enter platform URLs and click "Analyze Reviews" to get started</p>
    </div>
  );
};
