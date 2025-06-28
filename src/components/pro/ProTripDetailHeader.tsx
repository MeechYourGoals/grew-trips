
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Crown } from 'lucide-react';
import { UniversalTripAI } from '../UniversalTripAI';

interface ProTripDetailHeaderProps {
  tripContext: any;
  onSettingsOpen: () => void;
}

export const ProTripDetailHeader = ({ tripContext, onSettingsOpen }: ProTripDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
      >
        <div className="bg-gray-800 p-2 rounded-lg shadow-lg group-hover:shadow-yellow-500/20 transition-all border border-gray-700 hover:border-yellow-500/50">
          <ArrowLeft size={20} />
        </div>
        <span className="font-medium">Back to Trips</span>
      </button>

      <div className="flex items-center gap-4">
        {/* Universal Trip AI Button */}
        <UniversalTripAI tripContext={tripContext} />

        <div className="bg-gradient-to-r from-glass-orange to-glass-yellow p-2 rounded-lg">
          <Crown size={20} className="text-white" />
        </div>
        <button
          onClick={onSettingsOpen}
          className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-yellow-500/50"
        >
          <Settings size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};
