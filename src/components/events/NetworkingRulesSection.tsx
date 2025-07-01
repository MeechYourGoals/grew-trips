
import React from 'react';
import { Network, Users, MessageCircle, Calendar } from 'lucide-react';

export const NetworkingRulesSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Networking & Matchmaking Rules</h3>
      
      {/* Matchmaking Algorithm */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Network size={20} />
          AI Matchmaking Settings
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Matching Criteria Priority</label>
              <div className="space-y-2">
                {['Industry/Sector', 'Job Function', 'Company Size', 'Geographic Location', 'Interests/Goals'].map((criteria, index) => (
                  <div key={criteria} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">{criteria}</span>
                    <select className="bg-gray-800/50 border border-gray-600 text-white rounded px-3 py-1 text-sm">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Networking Preferences</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-glass-orange bg-gray-800 border-gray-600 rounded" />
                  <span className="text-gray-300">Enable mutual interest matching</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-glass-orange bg-gray-800 border-gray-600 rounded" />
                  <span className="text-gray-300">Allow cross-industry connections</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-glass-orange bg-gray-800 border-gray-600 rounded" />
                  <span className="text-gray-300">Prioritize similar experience levels</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-glass-orange bg-gray-800 border-gray-600 rounded" />
                  <span className="text-gray-300">Include complementary skill matching</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Limits */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users size={20} />
          Connection & Interaction Limits
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Daily Connection Requests</label>
            <input 
              type="number" 
              defaultValue="10"
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Max Connections Per Person</label>
            <input 
              type="number" 
              defaultValue="50"
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Meeting Duration (minutes)</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>15</option>
              <option>30</option>
              <option>45</option>
              <option>60</option>
            </select>
          </div>
        </div>
      </div>

      {/* Networking Sessions */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Structured Networking Sessions
        </h4>
        <div className="space-y-4">
          {[
            { name: 'Speed Networking Round 1', time: '10:30 - 11:15', format: 'Round Robin', participants: '50' },
            { name: 'Industry Meetup: FinTech', time: '14:00 - 15:00', format: 'Open Discussion', participants: '25' },
            { name: 'Startup Pitch & Connect', time: '16:30 - 17:30', format: 'Pitch + Network', participants: '30' }
          ].map((session) => (
            <div key={session.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-medium">{session.name}</h5>
                <div className="text-sm text-glass-orange">{session.participants} participants</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                <div>Time: {session.time}</div>
                <div>Format: {session.format}</div>
                <div>
                  <button className="text-glass-orange hover:text-glass-orange/80">
                    Manage Session
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full bg-glass-orange/20 hover:bg-glass-orange/30 text-glass-orange border border-glass-orange/30 rounded-lg py-3 font-medium">
            + Schedule New Networking Session
          </button>
        </div>
      </div>

      {/* Communication Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageCircle size={20} />
          Communication Rules
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Message Approval</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>No Moderation</option>
              <option>Auto-Filter Inappropriate</option>
              <option>Manual Review Required</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Contact Info Sharing</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Opt-in Required</option>
              <option>Automatic After Connection</option>
              <option>Never Share</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Follow-up Reminders</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Connection Expiry</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Never</option>
              <option>30 days post-event</option>
              <option>90 days post-event</option>
              <option>1 year post-event</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
