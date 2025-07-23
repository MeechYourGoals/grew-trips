
import React, { useState } from 'react';
import { MessageSquare, Shield, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export const NetworkingRulesSection = () => {
  const [communicationRules, setCommunicationRules] = useState({
    allowDirectMessages: true,
    allowGroupMessages: true,
    allowFileSharing: true,
    allowVoiceMessages: false,
    moderationEnabled: true,
    profanityFilter: true,
    reportingEnabled: true,
    customRules: ''
  });

  const handleToggle = (setting: string) => {
    setCommunicationRules(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleCustomRulesChange = (value: string) => {
    setCommunicationRules(prev => ({
      ...prev,
      customRules: value
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
        <MessageSquare size={24} className="text-glass-orange" />
        Communication Rules
      </h3>

      {/* Communication Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users size={20} className="text-glass-orange" />
          Communication Settings
        </h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Direct Messages</div>
              <div className="text-sm text-gray-400">Allow attendees to send direct messages to each other</div>
            </div>
            <button
              onClick={() => handleToggle('allowDirectMessages')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                communicationRules.allowDirectMessages ? 'bg-glass-orange' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                communicationRules.allowDirectMessages ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Group Messages</div>
              <div className="text-sm text-gray-400">Allow creation of group conversations</div>
            </div>
            <button
              onClick={() => handleToggle('allowGroupMessages')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                communicationRules.allowGroupMessages ? 'bg-glass-orange' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                communicationRules.allowGroupMessages ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">File Sharing</div>
              <div className="text-sm text-gray-400">Allow sharing of files and documents</div>
            </div>
            <button
              onClick={() => handleToggle('allowFileSharing')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                communicationRules.allowFileSharing ? 'bg-glass-orange' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                communicationRules.allowFileSharing ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Voice Messages</div>
              <div className="text-sm text-gray-400">Allow voice message recordings</div>
            </div>
            <button
              onClick={() => handleToggle('allowVoiceMessages')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                communicationRules.allowVoiceMessages ? 'bg-glass-orange' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                communicationRules.allowVoiceMessages ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Moderation Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-glass-orange" />
          Moderation & Safety
        </h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Content Moderation</div>
              <div className="text-sm text-gray-400">Enable automatic content moderation</div>
            </div>
            <button
              onClick={() => handleToggle('moderationEnabled')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                communicationRules.moderationEnabled ? 'bg-glass-orange' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                communicationRules.moderationEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Profanity Filter</div>
              <div className="text-sm text-gray-400">Filter inappropriate language</div>
            </div>
            <button
              onClick={() => handleToggle('profanityFilter')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                communicationRules.profanityFilter ? 'bg-glass-orange' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                communicationRules.profanityFilter ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Reporting System</div>
              <div className="text-sm text-gray-400">Allow users to report inappropriate content</div>
            </div>
            <button
              onClick={() => handleToggle('reportingEnabled')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                communicationRules.reportingEnabled ? 'bg-glass-orange' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                communicationRules.reportingEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Rules */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Custom Communication Rules</h4>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="customRules" className="text-white">Additional Rules</Label>
            <Textarea
              id="customRules"
              value={communicationRules.customRules}
              onChange={(e) => handleCustomRulesChange(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white mt-2"
              placeholder="Enter any additional communication rules or guidelines for your event..."
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-glass-orange hover:bg-glass-orange/80">
          Save Communication Rules
        </Button>
      </div>
    </div>
  );
};
