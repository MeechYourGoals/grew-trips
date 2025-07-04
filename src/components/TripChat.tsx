
import React, { useState, useEffect } from 'react';
import { Send, Search, MessageCircle, User, Settings } from 'lucide-react';
import { Channel, MessageList, MessageInput, Thread, Window } from 'stream-chat-react';
import { useGetStream } from '../hooks/useGetStream';
import { useParams } from 'react-router-dom';
import { VoiceAssistant } from './VoiceAssistant';

import 'stream-chat-react/dist/css/v2/index.css';

interface TripChatProps {
  groupChatEnabled?: boolean;
}

export const TripChat = ({ groupChatEnabled = true }: TripChatProps) => {
  const { tripId, eventId } = useParams();
  const { client, getTripChannel, isReady, isConnecting, error } = useGetStream();
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const currentTripId = tripId || eventId || 'default-trip';

  useEffect(() => {
    const initializeChannel = async () => {
      if (!isReady || !currentTripId) return;

      try {
        setLoading(true);
        const tripChannel = await getTripChannel(currentTripId);
        setChannel(tripChannel);
      } catch (err) {
        console.error('Failed to initialize chat channel:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeChannel();
  }, [isReady, currentTripId, getTripChannel]);

  // Show disabled chat notice for large events
  if (!groupChatEnabled) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
            <Settings size={48} className="text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-300 mb-2">
              Group Chat Disabled
            </h4>
            <p className="text-gray-500 text-sm mb-4">
              Group chat has been disabled for this event to manage large-scale communication. 
              You can still access broadcasts, calendar updates, and other event information.
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-400 text-sm">
              <MessageCircle size={16} />
              <span>Check Broadcasts for important updates</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isConnecting || loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <MessageCircle size={48} className="text-blue-400 mx-auto mb-4 animate-pulse" />
          <h4 className="text-lg font-medium text-gray-300 mb-2">Connecting to Chat...</h4>
          <p className="text-gray-500 text-sm">Setting up real-time messaging</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-md mx-auto">
            <MessageCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-red-300 mb-2">
              Chat Connection Failed
            </h4>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show GetStream chat interface
  if (!client || !channel) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-400 mb-2">No Chat Available</h4>
          <p className="text-gray-500 text-sm">Unable to load chat for this trip</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle size={24} className="text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Event Chat</h3>
            <p className="text-gray-400 text-sm">Real-time group conversation</p>
          </div>
        </div>
      </div>

      {/* GetStream Chat Interface */}
      <div className="bg-gray-900/50 rounded-xl overflow-hidden">
        <Channel channel={channel}>
          <Window>
            <MessageList />
            <MessageInput 
              focus
              additionalTextareaProps={{
                placeholder: "Type your message...",
                className: "bg-gray-800 text-white placeholder-gray-400"
              }}
            />
          </Window>
          <Thread />
        </Channel>
      </div>
    </div>
  );
};
