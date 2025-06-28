
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Settings, UserPlus, Crown } from 'lucide-react';
import { UniversalTripAI } from '../UniversalTripAI';
import { useAuth } from '../../hooks/useAuth';
import { useConsumerSubscription } from '../../hooks/useConsumerSubscription';

interface TripDetailHeaderProps {
  tripContext: any;
  showInbox: boolean;
  onToggleInbox: () => void;
  onShowInvite: () => void;
  onShowTripSettings: () => void;
  onShowAuth: () => void;
}

export const TripDetailHeader = ({
  tripContext,
  showInbox,
  onToggleInbox,
  onShowInvite,
  onShowTripSettings,
  onShowAuth
}: TripDetailHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPlus } = useConsumerSubscription();

  return (
    <div className="flex items-center justify-between mb-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
      >
        <div className="bg-gray-800 p-2 rounded-lg shadow-lg group-hover:shadow-red-500/20 transition-all border border-gray-700 hover:border-red-500/50">
          <ArrowLeft size={20} />
        </div>
        <span className="font-medium">Back to My Places</span>
      </button>

      <div className="flex items-center gap-3">
        {/* Universal Trip AI Button */}
        <UniversalTripAI tripContext={tripContext} />

        {/* Trips Plus Badge */}
        {isPlus && (
          <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 backdrop-blur-sm border border-glass-orange/30 rounded-xl px-4 py-2 flex items-center gap-2">
            <Crown size={16} className="text-glass-orange" />
            <span className="text-glass-orange font-medium">TRIPS PLUS</span>
          </div>
        )}

        {user ? (
          <>
            <button
              onClick={onShowInvite}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              <UserPlus size={16} />
              <span className="hidden sm:inline">Invite</span>
            </button>
            
            <button
              onClick={onToggleInbox}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              <MessageCircle size={16} />
              <span className="hidden sm:inline">{showInbox ? 'Hide Inbox' : 'Messages'}</span>
            </button>

            <button
              onClick={onShowTripSettings}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-xl transition-colors"
            >
              <Settings size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={onShowAuth}
            className="bg-gradient-to-r from-glass-orange to-glass-yellow text-white px-6 py-2 rounded-xl transition-colors font-medium"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};
