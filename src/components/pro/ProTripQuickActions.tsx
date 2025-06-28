
import React from 'react';
import { MessageSquare, FileText, Users } from 'lucide-react';

export const ProTripQuickActions = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-glass-orange/50 rounded-2xl p-6 transition-all duration-300 text-left group">
        <MessageSquare className="text-glass-orange mb-3 group-hover:scale-110 transition-transform" size={24} />
        <div className="text-white font-medium mb-1">Team Chat</div>
        <div className="text-gray-400 text-sm">Communicate with your team</div>
      </button>
      
      <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-glass-yellow/50 rounded-2xl p-6 transition-all duration-300 text-left group">
        <FileText className="text-glass-yellow mb-3 group-hover:scale-110 transition-transform" size={24} />
        <div className="text-white font-medium mb-1">Documents</div>
        <div className="text-gray-400 text-sm">Contracts, schedules, and files</div>
      </button>
      
      <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-glass-green/50 rounded-2xl p-6 transition-all duration-300 text-left group">
        <Users className="text-glass-green mb-3 group-hover:scale-110 transition-transform" size={24} />
        <div className="text-white font-medium mb-1">Broadcasts</div>
        <div className="text-gray-400 text-sm">Send updates to all members</div>
      </button>
    </div>
  );
};
