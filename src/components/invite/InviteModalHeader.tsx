import React from 'react';
import { X } from 'lucide-react';

interface InviteModalHeaderProps {
  tripName: string;
  onClose: () => void;
}

export const InviteModalHeader = ({ tripName, onClose }: InviteModalHeaderProps) => {
  return (
    <div className="sticky top-0 bg-white/10 backdrop-blur-md z-10 -mx-6 px-6 py-4 border-b border-white/10">
      {/* Close Button - Fixed Position */}
      <button 
        onClick={onClose} 
        className="absolute top-3 right-3 z-10 hover:bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        title="Close"
      >
        <X size={18} />
      </button>

      {/* Header Content */}
      <div className="pr-10">
        <h2 className="text-xl font-bold text-white">Invite to Trip</h2>
        <p className="text-gray-400 text-sm">{tripName}</p>
      </div>
    </div>
  );
};