
import React, { useState } from 'react';
import { Send, MapPin, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Participant {
  id: string | number;
  name: string;
  role: string;
}

interface BroadcastComposerProps {
  participants: Participant[];
  tripTier?: 'consumer' | 'pro' | 'event';
  onSend: (broadcast: {
    message: string;
    location?: string;
    category: 'chill' | 'logistics' | 'urgent';
    recipients: string;
  }) => void;
}

export const BroadcastComposer = ({ participants, tripTier = 'consumer', onSend }: BroadcastComposerProps) => {
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'chill' | 'logistics' | 'urgent'>('chill');
  const [showDetails, setShowDetails] = useState(false);
  const [recipient, setRecipient] = useState('everyone');
  const [translateTo, setTranslateTo] = useState<string>('none');

  const languages = [
    { code: 'none', name: 'No Translation' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' }
  ];

  const roleOptions = Array.from(new Set(participants.map(p => p.role)));
  const isConsumerTrip = tripTier === 'consumer';

  const handleSend = () => {
    if (!message.trim()) return;

    onSend({
      message: message.trim(),
      location: location.trim() || undefined,
      category,
      recipients: recipient
    });

    // Reset form
    setMessage('');
    setLocation('');
    setCategory('chill');
    setRecipient('everyone');
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
               {!isConsumerTrip && (
                 <div className="flex items-center gap-2 ml-4">
                   <Languages size={14} className="text-slate-400" />
                   <Select value={translateTo} onValueChange={setTranslateTo}>
                     <SelectTrigger className="w-32 h-6 bg-slate-700 border-slate-600 text-white text-xs">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       {languages.map((lang) => (
                         <SelectItem key={lang.code} value={lang.code} className="text-xs">
                           {lang.name}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               )}
              <span className="text-xs text-slate-500">
                {message.length}/140
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Recipient selector - only for Pro/Event trips */}
              {!isConsumerTrip && (
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-slate-700 text-white text-xs rounded px-2 py-1"
                >
                  <option value="everyone">Everyone</option>
                  {roleOptions.map((role) => (
                    <option key={`role-${role}`} value={`role:${role}`}>
                      {role}
                    </option>
                  ))}
                  {participants.map((p) => (
                    <option key={`user-${p.id}`} value={`user:${p.id}`}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Category selector - only for Pro/Event trips */}
              {!isConsumerTrip && (
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
              )}
              
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
