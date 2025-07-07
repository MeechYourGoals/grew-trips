import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, MapPin, Activity } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface HeatMapData {
  location: string;
  currentAttendees: number;
  maxCapacity: number;
  averageEngagement: number;
  peakTime: string;
}

interface EngagementMetrics {
  timestamp: string;
  totalActive: number;
  chatMessages: number;
  questionsAsked: number;
  networkingConnections: number;
}

export const HeatMapDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('live');
  const [selectedMetric, setSelectedMetric] = useState('attendance');
  const [heatMapData, setHeatMapData] = useState<HeatMapData[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementMetrics[]>([]);

  useEffect(() => {
    // Mock data - replace with real API calls
    setHeatMapData([
      {
        location: 'Main Auditorium',
        currentAttendees: 485,
        maxCapacity: 500,
        averageEngagement: 92,
        peakTime: '10:30 AM'
      },
      {
        location: 'Room A - Tech Track',
        currentAttendees: 125,
        maxCapacity: 150,
        averageEngagement: 88,
        peakTime: '11:00 AM'
      },
      {
        location: 'Room B - Business Track',
        currentAttendees: 98,
        maxCapacity: 120,
        averageEngagement: 76,
        peakTime: '2:15 PM'
      },
      {
        location: 'Networking Lounge',
        currentAttendees: 67,
        maxCapacity: 80,
        averageEngagement: 95,
        peakTime: '12:30 PM'
      },
      {
        location: 'Exhibition Hall',
        currentAttendees: 156,
        maxCapacity: 200,
        averageEngagement: 82,
        peakTime: '1:45 PM'
      }
    ]);

    setEngagementData([
      {
        timestamp: '9:00 AM',
        totalActive: 234,
        chatMessages: 45,
        questionsAsked: 12,
        networkingConnections: 8
      },
      {
        timestamp: '10:00 AM',
        totalActive: 456,
        chatMessages: 89,
        questionsAsked: 23,
        networkingConnections: 15
      },
      {
        timestamp: '11:00 AM',
        totalActive: 523,
        chatMessages: 134,
        questionsAsked: 31,
        networkingConnections: 22
      },
      {
        timestamp: '12:00 PM',
        totalActive: 378,
        chatMessages: 67,
        questionsAsked: 18,
        networkingConnections: 34
      }
    ]);
  }, [selectedTimeframe]);

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getEngagementColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const totalActiveAttendees = heatMapData.reduce((sum, item) => sum + item.currentAttendees, 0);
  const totalCapacity = heatMapData.reduce((sum, item) => sum + item.maxCapacity, 0);
  const overallUtilization = Math.round((totalActiveAttendees / totalCapacity) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity size={24} className="text-glass-orange" />
          <div>
            <h3 className="text-xl font-bold text-white">Real-Time Heat Map Dashboard</h3>
            <p className="text-gray-400">Live attendance and engagement tracking</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="1hour">Last Hour</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40 bg-gray-800/50 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-400" />
            <span className="text-gray-400 text-sm">Total Active</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalActiveAttendees}</div>
          <div className="text-xs text-gray-500">of {totalCapacity} capacity</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-gray-400 text-sm">Utilization</span>
          </div>
          <div className="text-2xl font-bold text-white">{overallUtilization}%</div>
          <div className="text-xs text-green-400">↑ 12% vs yesterday</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-purple-400" />
            <span className="text-gray-400 text-sm">Avg Engagement</span>
          </div>
          <div className="text-2xl font-bold text-white">85%</div>
          <div className="text-xs text-purple-400">High activity</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-orange-400" />
            <span className="text-gray-400 text-sm">Peak Time</span>
          </div>
          <div className="text-2xl font-bold text-white">11:00</div>
          <div className="text-xs text-gray-500">AM</div>
        </div>
      </div>

      {/* Heat Map Grid */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Location Heat Map</h4>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {heatMapData.map((location, index) => {
            const attendancePercentage = Math.round((location.currentAttendees / location.maxCapacity) * 100);
            
            return (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <h5 className="font-medium text-white text-sm">{location.location}</h5>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getAttendanceColor(attendancePercentage)}`}></div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Attendance</span>
                    <span className="text-white">{location.currentAttendees}/{location.maxCapacity}</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getAttendanceColor(attendancePercentage)}`}
                      style={{ width: `${attendancePercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Engagement</span>
                    <span className={getEngagementColor(location.averageEngagement)}>
                      {location.averageEngagement}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Peak</span>
                    <span className="text-gray-300">{location.peakTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engagement Timeline */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Engagement Timeline</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-gray-400 font-medium">Time</th>
                <th className="text-center py-2 text-gray-400 font-medium">Active Users</th>
                <th className="text-center py-2 text-gray-400 font-medium">Chat Messages</th>
                <th className="text-center py-2 text-gray-400 font-medium">Questions</th>
                <th className="text-center py-2 text-gray-400 font-medium">Connections</th>
              </tr>
            </thead>
            <tbody>
              {engagementData.map((data, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3 text-white font-medium">{data.timestamp}</td>
                  <td className="text-center py-3 text-blue-400">{data.totalActive}</td>
                  <td className="text-center py-3 text-green-400">{data.chatMessages}</td>
                  <td className="text-center py-3 text-purple-400">{data.questionsAsked}</td>
                  <td className="text-center py-3 text-orange-400">{data.networkingConnections}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Alerts */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Live Alerts</h4>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="text-red-400 font-medium">High Capacity Alert</div>
              <div className="text-gray-300 text-sm">Main Auditorium is at 97% capacity</div>
            </div>
            <div className="text-gray-500 text-xs">2 min ago</div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-yellow-400 font-medium">Low Engagement</div>
              <div className="text-gray-300 text-sm">Room B engagement dropped to 45%</div>
            </div>
            <div className="text-gray-500 text-xs">5 min ago</div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-green-400 font-medium">Peak Activity</div>
              <div className="text-gray-300 text-sm">Networking Lounge reached highest engagement</div>
            </div>
            <div className="text-gray-500 text-xs">8 min ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};