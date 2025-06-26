
import React from 'react';
import { Users, User, Settings } from 'lucide-react';

interface SeatManagementSectionProps {
  organization: {
    seatLimit: number;
    seatsUsed: number;
  };
}

export const SeatManagementSection = ({ organization }: SeatManagementSectionProps) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-white">Seat Management</h3>
    
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-white">Team Members</h4>
        <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Invite Member
        </button>
      </div>
      
      {/* Seat Usage Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{organization.seatsUsed}</div>
          <div className="text-sm text-gray-400">Active Seats</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{organization.seatLimit - organization.seatsUsed}</div>
          <div className="text-sm text-gray-400">Available Seats</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{organization.seatLimit}</div>
          <div className="text-sm text-gray-400">Total Seats</div>
        </div>
      </div>

      {/* Mock Team Members */}
      <div className="space-y-3">
        {[
          { name: 'Sarah Johnson', email: 'sarah@acme.com', role: 'Admin', status: 'Active', joinedAt: '2024-01-15' },
          { name: 'Mike Chen', email: 'mike@acme.com', role: 'Member', status: 'Active', joinedAt: '2024-02-01' },
          { name: 'Lisa Rodriguez', email: 'lisa@acme.com', role: 'Member', status: 'Pending', joinedAt: '2024-02-15' }
        ].map((member, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-glass-orange to-glass-yellow rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-medium">{member.name}</div>
                <div className="text-sm text-gray-400">{member.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="text-white">{member.role}</div>
                <div className={`text-xs ${
                  member.status === 'Active' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {member.status}
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Settings size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
