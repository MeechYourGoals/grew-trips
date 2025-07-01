
import React from 'react';
import { BarChart, TrendingUp, Users, DollarSign, Clock, MapPin } from 'lucide-react';

export const EventAnalyticsSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Event Analytics & Reporting</h3>
      
      {/* Key Metrics Overview */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart size={20} />
          Key Performance Metrics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <Users size={24} className="text-glass-orange mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">847</div>
            <div className="text-sm text-gray-400">Total Registrations</div>
            <div className="text-xs text-green-400 mt-1">+12% vs target</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <TrendingUp size={24} className="text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">734</div>
            <div className="text-sm text-gray-400">Actual Attendance</div>
            <div className="text-xs text-green-400 mt-1">87% show-up rate</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <DollarSign size={24} className="text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">$127K</div>
            <div className="text-sm text-gray-400">Revenue Generated</div>
            <div className="text-xs text-green-400 mt-1">103% of goal</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <Clock size={24} className="text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">4.7</div>
            <div className="text-sm text-gray-400">Avg Session Rating</div>
            <div className="text-xs text-green-400 mt-1">+0.3 vs last year</div>
          </div>
        </div>
      </div>

      {/* Attendance Analytics */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Attendance Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-white font-medium mb-3">By Attendee Type</h5>
            <div className="space-y-3">
              {[
                { type: 'General Attendees', count: 547, percentage: 74 },
                { type: 'VIP Guests', count: 89, percentage: 12 },
                { type: 'Speakers', count: 34, percentage: 5 },
                { type: 'Exhibitors', count: 64, percentage: 9 }
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-glass-orange h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium w-12 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-white font-medium mb-3">Geographic Distribution</h5>
            <div className="space-y-3">
              {[
                { location: 'California', count: 245, percentage: 33 },
                { location: 'New York', count: 156, percentage: 21 },
                { location: 'Texas', count: 98, percentage: 13 },
                { location: 'International', count: 235, percentage: 32 }
              ].map((item) => (
                <div key={item.location} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.location}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium w-12 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Session Analytics */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Session Performance</h4>
        <div className="space-y-4">
          {[
            { name: 'Opening Keynote: Future of AI', attendance: '734/734', rating: 4.9, engagement: '94%' },
            { name: 'Panel: Ethics in Technology', attendance: '456/500', rating: 4.7, engagement: '87%' },
            { name: 'Workshop: Hands-on Machine Learning', attendance: '89/100', rating: 4.8, engagement: '92%' },
            { name: 'Networking Lunch', attendance: '623/734', rating: 4.2, engagement: '78%' },
            { name: 'Fireside Chat: Startup Success Stories', attendance: '234/300', rating: 4.6, engagement: '89%' }
          ].map((session) => (
            <div key={session.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-medium">{session.name}</h5>
                <button className="text-glass-orange hover:text-glass-orange/80 text-sm">
                  View Details
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Attendance: </span>
                  <span className="text-white">{session.attendance}</span>
                </div>
                <div>
                  <span className="text-gray-400">Rating: </span>
                  <span className="text-yellow-400">★ {session.rating}</span>
                </div>
                <div>
                  <span className="text-gray-400">Engagement: </span>
                  <span className="text-green-400">{session.engagement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Revenue Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="text-white font-medium mb-3">Revenue Sources</h5>
            <div className="space-y-3">
              {[
                { source: 'Ticket Sales', amount: '$89,450', percentage: 70 },
                { source: 'Sponsorships', amount: '$32,000', percentage: 25 },
                { source: 'Merchandise', amount: '$5,550', percentage: 4 }
              ].map((item) => (
                <div key={item.source} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.source}</span>
                  <div className="text-right">
                    <div className="text-white font-medium">{item.amount}</div>
                    <div className="text-sm text-gray-400">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-white font-medium mb-3">Expenses</h5>
            <div className="space-y-3">
              {[
                { expense: 'Venue Rental', amount: '$25,000' },
                { expense: 'Catering', amount: '$18,750' },
                { expense: 'A/V Equipment', amount: '$12,500' },
                { expense: 'Marketing', amount: '$8,200' }
              ].map((item) => (
                <div key={item.expense} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.expense}</span>
                  <span className="text-red-400">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-white font-medium mb-3">Profit Summary</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Revenue</span>
                <span className="text-green-400 font-bold">$127,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Expenses</span>
                <span className="text-red-400 font-bold">$64,450</span>
              </div>
              <div className="border-t border-white/20 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Net Profit</span>
                  <span className="text-glass-orange font-bold text-xl">$62,550</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Export Reports</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-glass-orange/20 hover:bg-glass-orange/30 text-glass-orange border border-glass-orange/30 rounded-lg py-3 px-4 font-medium">
            Export Attendance Report
          </button>
          <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg py-3 px-4 font-medium">
            Export Financial Summary
          </button>
          <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg py-3 px-4 font-medium">
            Export Engagement Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
