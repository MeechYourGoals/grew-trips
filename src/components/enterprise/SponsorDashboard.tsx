
import React, { useState } from 'react';
import { Star, Upload, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const SponsorDashboard = () => {
  const [deliverables] = useState([
    {
      id: '1',
      sponsorName: 'Nike',
      deliverable: 'Logo placement on stage backdrop',
      deadline: '2025-01-20',
      status: 'completed' as const,
      assignedTo: 'Production Team'
    },
    {
      id: '2',
      sponsorName: 'Pepsi',
      deliverable: 'Social media mention posts (3x)',
      deadline: '2025-01-25',
      status: 'in-progress' as const,
      assignedTo: 'Marketing Team'
    },
    {
      id: '3',
      sponsorName: 'Samsung',
      deliverable: 'Product placement in VIP area',
      deadline: '2025-01-18',
      status: 'overdue' as const,
      assignedTo: 'Event Coordinator'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-400" />;
      case 'in-progress': return <Clock size={16} className="text-yellow-400" />;
      case 'overdue': return <AlertTriangle size={16} className="text-red-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'overdue': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star size={24} className="text-glass-orange" />
          Sponsor Deliverables
        </h3>
        <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium">
          Add Deliverable
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{deliverables.length}</div>
          <div className="text-sm text-gray-400">Total Deliverables</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {deliverables.filter(d => d.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {deliverables.filter(d => d.status === 'in-progress').length}
          </div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">
            {deliverables.filter(d => d.status === 'overdue').length}
          </div>
          <div className="text-sm text-gray-400">Overdue</div>
        </div>
      </div>

      {/* Deliverables List */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Active Deliverables</h4>
        <div className="space-y-4">
          {deliverables.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <h5 className="text-white font-medium">{item.sponsorName}</h5>
                    <p className="text-sm text-gray-400">{item.deliverable}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.toUpperCase().replace('-', ' ')}
                  </span>
                  <button className="text-glass-orange hover:text-glass-orange/80 text-sm">Edit</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-gray-400">
                  <span className="text-white">Deadline:</span> {item.deadline}
                </div>
                <div className="text-gray-400">
                  <span className="text-white">Assigned to:</span> {item.assignedTo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo Upload Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Upload size={20} />
          Sponsor Assets
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Nike', 'Pepsi', 'Samsung'].map((sponsor) => (
            <div key={sponsor} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-white font-medium mb-2">{sponsor}</div>
              <div className="w-full h-24 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center mb-3">
                <div className="text-center">
                  <Upload size={24} className="text-gray-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Upload Logo</div>
                </div>
              </div>
              <button className="w-full bg-glass-orange/20 hover:bg-glass-orange/30 text-glass-orange border border-glass-orange/30 rounded py-2 text-sm">
                Browse Files
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
