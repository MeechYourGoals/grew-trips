
import React, { useState } from 'react';
import { Send, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import type { EventSegment } from './events/eventSegments';

interface BroadcastComposerProps {
  onSend: (broadcast: {
    message: string;
    location?: string;
    category: 'chill' | 'logistics' | 'urgent';
    segmentId?: string;
  }) => void;
  segments?: EventSegment[];
}
export const BroadcastComposer = ({ onSend, segments }: BroadcastComposerProps) => {
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'chill' | 'logistics' | 'urgent'>('chill');
  const [segmentId, setSegmentId] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;

    onSend({
      message: message.trim(),
      location: location.trim() || undefined,
      category,
      segmentId: segmentId || undefined
    });

    // Reset form
    setMessage('');
    setLocation('');
    setCategory('chill');
    setSegmentId('');
    setShowDetails(false);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'chill': return 'bg-blue-600';
      case 'logistics': return 'bg-yellow-600';
      case 'urgent': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Send size={16} className="text-white" />
        </div>
        <div className="flex-1">
          {segments && segments.length > 0 && (
            <select
              value={segmentId}
              onChange={(e) => setSegmentId(e.target.value)}
              className="mb-3 w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none"
            >
              <option value="">All Participants</option>
              {segments.map((seg) => (
                <option key={seg.id} value={seg.id}>
                  {seg.name}
                  {seg.count ? ` (${seg.count})` : ''}
                </option>
              ))}
            </select>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share an update with the group..."
            maxLength={140}
            rows={2}
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
          />
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-slate-400 hover:text-white text-sm flex items-center gap-1"
              >
                <MapPin size={14} />
                Add details
              </button>
              <span className="text-xs text-slate-500">
                {message.length}/140
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Category selector */}
              <div className="flex gap-1">
                {(['chill', 'logistics', 'urgent'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      category === cat
                        ? `${getCategoryColor(cat)} text-white`
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
              >
                Broadcast
              </Button>
            </div>
          </div>

          {/* Additional details */}
          {showDetails && (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (optional)"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
