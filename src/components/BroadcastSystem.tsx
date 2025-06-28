
import React, { useState } from 'react';
import { Send, Radio, AlertTriangle, Users } from 'lucide-react';
import { Broadcast } from '../types/pro';

interface BroadcastSystemProps {
  tourId: string;
}

export const BroadcastSystem = ({ tourId }: BroadcastSystemProps) => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [targetTrips, setTargetTrips] = useState<string[]>([]);
  const [showComposer, setShowComposer] = useState(false);

  const mockBroadcasts: Broadcast[] = [
    {
      id: '1',
      senderId: 'user1',
      message: 'Sound check moved to 5:30 PM for all venues this week',
      targetTrips: [],
      priority: 'urgent',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      readBy: ['user1', 'user2']
    },
    {
      id: '2',
      senderId: 'user2',
      message: 'New merch designs uploaded to the shared drive',
      targetTrips: ['trip1', 'trip2'],
      priority: 'normal',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      readBy: ['user1', 'user2', 'user3']
    }
  ];

  const handleSendBroadcast = () => {
    if (!message.trim()) return;
    
    // Here you would send the broadcast to your backend
    console.log('Sending broadcast:', {
      message,
      priority,
      targetTrips,
      tourId
    });

    setMessage('');
    setPriority('normal');
    setTargetTrips([]);
    setShowComposer(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-glass-orange/30 to-glass-yellow/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Radio size={24} className="text-glass-orange" />
          </div>
          <h2 className="text-xl font-semibold text-white">Broadcasts</h2>
        </div>
        <button
          onClick={() => setShowComposer(!showComposer)}
          className="bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <Send size={16} />
          Broadcast
        </button>
      </div>

      {/* Broadcast Composer */}
      {showComposer && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message to your team..."
            rows={3}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-glass-orange resize-none"
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPriority('normal')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    priority === 'normal' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setPriority('urgent')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                    priority === 'urgent' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <AlertTriangle size={12} />
                  Urgent
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-gray-400">
                <Users size={14} />
                <span className="text-xs">
                  {targetTrips.length === 0 ? 'All trips' : `${targetTrips.length} selected`}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleSendBroadcast}
              disabled={!message.trim()}
              className="bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-xl transition-all duration-200"
            >
              Send Broadcast
            </button>
          </div>
        </div>
      )}

      {/* Recent Broadcasts */}
      <div className="space-y-4">
        {mockBroadcasts.map((broadcast) => (
          <div key={broadcast.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-glass-green/30 to-glass-yellow/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">M</span>
                </div>
                <div>
                  <div className="text-white font-medium">Manager</div>
                  <div className="text-gray-400 text-xs">{formatTime(broadcast.timestamp)}</div>
                </div>
              </div>
              
              {broadcast.priority === 'urgent' && (
                <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                  <AlertTriangle size={10} />
                  Urgent
                </div>
              )}
            </div>
            
            <p className="text-white mb-3 leading-relaxed">{broadcast.message}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-gray-400 text-xs">
                {broadcast.targetTrips.length === 0 ? 'Sent to all trips' : `Sent to ${broadcast.targetTrips.length} trips`}
              </div>
              <div className="text-gray-400 text-xs">
                Read by {broadcast.readBy.length} members
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
