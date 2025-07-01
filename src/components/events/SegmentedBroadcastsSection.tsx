
import React from 'react';
import { Megaphone, Target, Send, Clock } from 'lucide-react';

export const SegmentedBroadcastsSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Segmented Broadcast System</h3>
      
      {/* Audience Segments */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target size={20} />
          Audience Segments
        </h4>
        <div className="space-y-4">
          {[
            { name: 'All Attendees', count: '847', criteria: 'Everyone registered' },
            { name: 'VIP Guests', count: '67', criteria: 'VIP ticket holders' },
            { name: 'Speakers & Panelists', count: '24', criteria: 'Speaker role assigned' },
            { name: 'First-time Attendees', count: '312', criteria: 'New to event series' },
            { name: 'Tech Industry', count: '445', criteria: 'Industry = Technology' },
            { name: 'Local Attendees', count: '203', criteria: 'Within 50 miles of venue' }
          ].map((segment) => (
            <div key={segment.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h5 className="text-white font-medium">{segment.name}</h5>
                  <span className="bg-glass-orange/20 text-glass-orange px-2 py-1 rounded-full text-sm">
                    {segment.count} people
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="text-glass-orange hover:text-glass-orange/80 text-sm">Edit</button>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">Send Message</button>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{segment.criteria}</p>
            </div>
          ))}
          <button className="w-full bg-glass-orange/20 hover:bg-glass-orange/30 text-glass-orange border border-glass-orange/30 rounded-lg py-3 font-medium">
            + Create New Segment
          </button>
        </div>
      </div>

      {/* Message Templates */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Send size={20} />
          Message Templates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Welcome Message', type: 'Email + Push', usage: '347 sent' },
            { name: 'Session Reminder', type: 'Push Only', usage: '1,203 sent' },
            { name: 'Networking Opportunity', type: 'In-App', usage: '89 sent' },
            { name: 'Event Update', type: 'Email + Push', usage: '756 sent' }
          ].map((template) => (
            <div key={template.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-white font-medium">{template.name}</h5>
                <button className="text-glass-orange hover:text-glass-orange/80 text-sm">Edit</button>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div>Type: {template.type}</div>
                <div>Usage: {template.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Broadcasts */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock size={20} />
          Recent Broadcasts
        </h4>
        <div className="space-y-4">
          {[
            { 
              subject: 'Welcome to Tech Summit 2025!',
              segment: 'All Attendees',
              sent: '2 hours ago',
              delivered: '847/847',
              opened: '623 (73%)',
              status: 'Completed'
            },
            { 
              subject: 'VIP Reception Tonight at 6 PM',
              segment: 'VIP Guests',
              sent: '4 hours ago',
              delivered: '67/67',
              opened: '58 (87%)',
              status: 'Completed'
            },
            { 
              subject: 'Speaker Briefing in 30 Minutes',
              segment: 'Speakers & Panelists',
              sent: '6 hours ago',
              delivered: '24/24',
              opened: '24 (100%)',
              status: 'Completed'
            }
          ].map((broadcast, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-medium">{broadcast.subject}</h5>
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                  {broadcast.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-400">
                <div>
                  <div className="text-xs text-gray-500">Audience</div>
                  <div>{broadcast.segment}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Delivered</div>
                  <div>{broadcast.delivered}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Opened</div>
                  <div>{broadcast.opened}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Sent</div>
                  <div>{broadcast.sent}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose New Broadcast */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Megaphone size={20} />
          Compose New Broadcast
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Select Audience</label>
              <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
                <option>All Attendees (847 people)</option>
                <option>VIP Guests (67 people)</option>
                <option>Speakers & Panelists (24 people)</option>
                <option>Tech Industry (445 people)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Delivery Method</label>
              <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
                <option>Email + Push Notification</option>
                <option>Email Only</option>
                <option>Push Notification Only</option>
                <option>In-App Message Only</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Subject Line</label>
            <input 
              type="text" 
              placeholder="Enter message subject..."
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Message Content</label>
            <textarea 
              rows={4}
              placeholder="Write your message here..."
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 resize-none"
            />
          </div>
          <div className="flex gap-4">
            <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-6 py-3 rounded-lg font-medium flex-1">
              Send Now
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium">
              Schedule Later
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium">
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
