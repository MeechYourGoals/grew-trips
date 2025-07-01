
import React from 'react';
import { Activity, MessageSquare, ThumbsUp, BarChart3 } from 'lucide-react';

export const LiveEngagementSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Live Engagement Features</h3>
      
      {/* Q&A Management */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} />
          Live Q&A Sessions
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Q&A Moderation</label>
              <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
                <option>Auto-approve all questions</option>
                <option>Moderator approval required</option>
                <option>AI filter + manual review</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Anonymous Questions</label>
              <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
                <option>Allowed</option>
                <option>Not allowed</option>
                <option>Speaker's choice</option>
              </select>
            </div>
          </div>
          
          {/* Current Q&A Sessions */}
          <div className="space-y-3">
            <h5 className="text-white font-medium">Active Q&A Sessions</h5>
            {[
              { session: 'AI Innovation Keynote', questions: 47, answered: 12, pending: 35 },
              { session: 'Future of Work Panel', questions: 23, answered: 18, pending: 5 }
            ].map((qa) => (
              <div key={qa.session} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="text-white font-medium">{qa.session}</h6>
                  <button className="text-glass-orange hover:text-glass-orange/80 text-sm">
                    Manage Q&A
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
                  <div>Total: <span className="text-white">{qa.questions}</span></div>
                  <div>Answered: <span className="text-green-400">{qa.answered}</span></div>
                  <div>Pending: <span className="text-yellow-400">{qa.pending}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Polling */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          Live Polling System
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Poll Display Duration</label>
              <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
                <option>30 seconds</option>
                <option>1 minute</option>
                <option>2 minutes</option>
                <option>Until manually closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Result Visibility</label>
              <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
                <option>Show results immediately</option>
                <option>Show after poll closes</option>
                <option>Speaker controls visibility</option>
              </select>
            </div>
          </div>

          {/* Create Quick Poll */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h5 className="text-white font-medium mb-3">Create Quick Poll</h5>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Enter your poll question..."
                className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
              />
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Option 1"
                  className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
                />
                <input 
                  type="text" 
                  placeholder="Option 2"
                  className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
                />
                <button className="text-glass-orange hover:text-glass-orange/80 text-sm">
                  + Add Option
                </button>
              </div>
              <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-6 py-2 rounded-lg font-medium">
                Launch Poll
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reaction System */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ThumbsUp size={20} />
          Live Reactions & Feedback
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Available Reactions</label>
              <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-lg">
                {['👍', '👏', '❤️', '😮', '🤔', '👎'].map((emoji) => (
                  <button key={emoji} className="text-2xl hover:scale-110 transition-transform">
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Reaction Settings</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-glass-orange bg-gray-800 border-gray-600 rounded" />
                  <span className="text-gray-300">Show reaction count to audience</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-glass-orange bg-gray-800 border-gray-600 rounded" />
                  <span className="text-gray-300">Allow multiple reactions per person</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-glass-orange bg-gray-800 border-gray-600 rounded" />
                  <span className="text-gray-300">Display reactions on screen</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live Reaction Feed */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h5 className="text-white font-medium mb-3">Current Session Reactions</h5>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
              {[
                { emoji: '👍', count: 247 },
                { emoji: '👏', count: 189 },
                { emoji: '❤️', count: 156 },
                { emoji: '😮', count: 92 },
                { emoji: '🤔', count: 34 },
                { emoji: '👎', count: 12 }
              ].map((reaction) => (
                <div key={reaction.emoji} className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl mb-1">{reaction.emoji}</div>
                  <div className="text-white font-bold">{reaction.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Analytics */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity size={20} />
          Real-time Engagement Analytics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-glass-orange">847</div>
            <div className="text-sm text-gray-400">Active Attendees</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">92%</div>
            <div className="text-sm text-gray-400">Engagement Rate</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">156</div>
            <div className="text-sm text-gray-400">Questions Asked</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">23</div>
            <div className="text-sm text-gray-400">Polls Launched</div>
          </div>
        </div>
      </div>
    </div>
  );
};
