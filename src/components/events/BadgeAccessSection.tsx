
import React from 'react';
import { Badge, Key, QrCode, Shield } from 'lucide-react';

export const BadgeAccessSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Badge Templates & Access Control</h3>
      
      {/* Badge Templates */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Badge size={20} />
          Badge Design Templates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Attendee', 'Speaker', 'VIP'].map((type) => (
            <div key={type} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="aspect-[3/4] bg-gradient-to-br from-glass-orange/20 to-purple-500/20 rounded-lg mb-3 p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-gray-300 mb-1">TECH SUMMIT 2025</div>
                  <div className="text-sm font-bold text-white">John Doe</div>
                  <div className="text-xs text-gray-400">Software Engineer</div>
                  <div className="text-xs text-gray-400">TechCorp Inc.</div>
                </div>
                <div className="flex items-center justify-between">
                  <QrCode size={24} className="text-white" />
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    type === 'VIP' ? 'bg-purple-500 text-white' :
                    type === 'Speaker' ? 'bg-blue-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {type}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h5 className="text-white font-medium mb-2">{type} Badge</h5>
                <button className="text-glass-orange hover:text-glass-orange/80 text-sm">
                  Customize Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Access Control */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield size={20} />
          Access Control Settings
        </h4>
        <div className="space-y-4">
          {[
            { area: 'Main Conference Hall', attendee: true, speaker: true, vip: true, exhibitor: false },
            { area: 'VIP Lounge', attendee: false, speaker: true, vip: true, exhibitor: false },
            { area: 'Speaker Green Room', attendee: false, speaker: true, vip: true, exhibitor: false },
            { area: 'Exhibition Hall', attendee: true, speaker: true, vip: true, exhibitor: true },
            { area: 'Networking Terrace', attendee: true, speaker: true, vip: true, exhibitor: true }
          ].map((area) => (
            <div key={area.area} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-medium">{area.area}</h5>
                <Key size={16} className="text-gray-400" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {['attendee', 'speaker', 'vip', 'exhibitor'].map((role) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked={area[role as keyof typeof area] as boolean}
                      className="w-4 h-4 text-glass-orange bg-gray-800 border-gray-600 rounded focus:ring-glass-orange/50"
                    />
                    <span className="text-sm text-gray-300 capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <QrCode size={20} />
          QR Code Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">QR Code Type</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Unique Per Attendee</option>
              <option>Role-Based</option>
              <option>Session-Specific</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Scan Action</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Check-in Only</option>
              <option>Access Control</option>
              <option>Session Entry</option>
              <option>Lead Capture</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">QR Code Size</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Small (25x25mm)</option>
              <option>Medium (35x35mm)</option>
              <option>Large (50x50mm)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Security Level</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Standard</option>
              <option>Encrypted</option>
              <option>Time-Limited</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
