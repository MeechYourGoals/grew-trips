
import React, { useState } from 'react';
import { Badge, QrCode, Shield, Users, Download } from 'lucide-react';

export const CredentialControl = () => {
  const [zones] = useState([
    { id: '1', name: 'General Admission', description: 'Public areas', accessLevel: 'public' as const },
    { id: '2', name: 'VIP Lounge', description: 'Premium guest areas', accessLevel: 'vip' as const },
    { id: '3', name: 'Backstage', description: 'Artist and crew only', accessLevel: 'staff-only' as const },
    { id: '4', name: 'Production Area', description: 'Technical crew access', accessLevel: 'restricted' as const }
  ]);

  const [roles] = useState(['Artist', 'Manager', 'Crew', 'Security', 'VIP Guest', 'Media']);

  const getAccessColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-green-500/20 text-green-400';
      case 'vip': return 'bg-purple-500/20 text-purple-400';
      case 'restricted': return 'bg-yellow-500/20 text-yellow-400';
      case 'staff-only': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Badge size={24} className="text-glass-orange" />
          Credential & Access Control
        </h3>
        <div className="flex gap-2">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <QrCode size={16} />
            Generate QR Codes
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Download size={16} />
            Export Badges
          </button>
        </div>
      </div>

      {/* Access Zones */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield size={20} />
          Access Zones
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => (
            <div key={zone.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-white font-medium">{zone.name}</h5>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getAccessColor(zone.accessLevel)}`}>
                  {zone.accessLevel.toUpperCase().replace('-', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-400">{zone.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role Matrix */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users size={20} />
          Role Access Matrix
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white font-medium p-3">Role</th>
                {zones.map((zone) => (
                  <th key={zone.id} className="text-center text-white font-medium p-3">
                    {zone.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role} className="border-b border-white/5">
                  <td className="text-white p-3">{role}</td>
                  {zones.map((zone) => (
                    <td key={zone.id} className="text-center p-3">
                      <input
                        type="checkbox"
                        defaultChecked={
                          (role === 'Artist' && zone.accessLevel === 'staff-only') ||
                          (role === 'Manager' && zone.accessLevel !== 'public') ||
                          (role === 'VIP Guest' && zone.accessLevel === 'vip') ||
                          zone.accessLevel === 'public'
                        }
                        className="w-4 h-4 bg-gray-800 border-gray-600 rounded focus:ring-glass-orange"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
