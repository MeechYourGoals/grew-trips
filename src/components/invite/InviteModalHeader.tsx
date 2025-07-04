import React from 'react';
import { X } from 'lucide-react';

interface InviteModalHeaderProps {
  tripName: string;
  onClose: () => void;
}

export const InviteModalHeader = ({ tripName, onClose }: InviteModalHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Invite to Trip</h2>
        <p className="text-gray-400 text-sm">{tripName}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-white">
        <X size={24} />
      </button>
    </div>
  );
};