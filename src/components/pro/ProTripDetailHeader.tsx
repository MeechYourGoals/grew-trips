
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Crown, MessageCircle, UserPlus } from 'lucide-react';
import { UniversalTripAI } from '../UniversalTripAI';
import { useAuth } from '../../hooks/useAuth';
import { useTripVariant } from '../../contexts/TripVariantContext';

interface ProTripDetailHeaderProps {
  tripContext: any;
  showInbox: boolean;
  onToggleInbox: () => void;
  onShowInvite: () => void;
  onShowTripSettings: () => void;
  onShowAuth: () => void;
}

export const ProTripDetailHeader = ({
  tripContext,
  showInbox,
  onToggleInbox,
  onShowInvite,
  onShowTripSettings,
  onShowAuth
}: ProTripDetailHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accentColors } = useTripVariant();

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

      <div className="flex items-center gap-3">
        {/* Universal Trip AI Button */}
        <UniversalTripAI tripContext={tripContext} />

        {/* Pro Badge */}
        <div className={`bg-gradient-to-r ${accentColors.gradient} backdrop-blur-sm border border-yellow-500/30 rounded-xl px-4 py-2 flex items-center gap-2`}>
          <Crown size={16} className="text-white" />
          <span className="text-white font-medium">PRO</span>
        </div>

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
            className={`bg-gradient-to-r ${accentColors.gradient} text-white px-6 py-2 rounded-xl transition-colors font-medium`}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};
