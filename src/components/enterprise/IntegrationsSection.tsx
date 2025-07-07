import React, { useState } from 'react';
import { Settings, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

export const IntegrationsSection = () => {
  const [saberEnabled, setSaberEnabled] = useState(true);
  const [concurEnabled, setConcurEnabled] = useState(false);
  const [quickbooksEnabled, setQuickbooksEnabled] = useState(true);
  const [slackEnabled, setSlackEnabled] = useState(true);

  const integrations = [
    {
      name: 'Saber Corporate Travel',
      description: 'Sync bookings and travel policies',
      enabled: saberEnabled,
      onToggle: setSaberEnabled,
      status: 'connected',
      category: 'booking'
    },
    {
      name: 'Concur Expense',
      description: 'Automated expense reporting',
      enabled: concurEnabled,
      onToggle: setConcurEnabled,
      status: 'available',
      category: 'booking'
    },
    {
      name: 'QuickBooks Online',
      description: 'Financial data synchronization',
      enabled: quickbooksEnabled,
      onToggle: setQuickbooksEnabled,
      status: 'connected',
      category: 'financial'
    },
    {
      name: 'Slack',
      description: 'Team communication integration',
      enabled: slackEnabled,
      onToggle: setSlackEnabled,
      status: 'connected',
      category: 'communication'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'available':
        return <AlertCircle size={16} className="text-yellow-400" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Integrations</h3>
        <Button variant="outline" size="sm">
          <Settings size={16} className="mr-2" />
          Manage All
        </Button>
      </div>

      {/* Travel Booking Systems */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          Travel Booking Systems
        </h4>
        <div className="space-y-4">
          {integrations.filter(i => i.category === 'booking').map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(integration.status)}
                <div>
                  <div className="text-white font-medium">{integration.name}</div>
                  <div className="text-sm text-gray-400">{integration.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {integration.status === 'connected' && (
                  <Button variant="ghost" size="sm">
                    <ExternalLink size={14} className="mr-1" />
                    Configure
                  </Button>
                )}
                <Switch
                  checked={integration.enabled}
                  onCheckedChange={integration.onToggle}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Tools */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Financial Tools</h4>
        <div className="space-y-4">
          {integrations.filter(i => i.category === 'financial').map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(integration.status)}
                <div>
                  <div className="text-white font-medium">{integration.name}</div>
                  <div className="text-sm text-gray-400">{integration.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <ExternalLink size={14} className="mr-1" />
                  Configure
                </Button>
                <Switch
                  checked={integration.enabled}
                  onCheckedChange={integration.onToggle}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Tools */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Communication</h4>
        <div className="space-y-4">
          {integrations.filter(i => i.category === 'communication').map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(integration.status)}
                <div>
                  <div className="text-white font-medium">{integration.name}</div>
                  <div className="text-sm text-gray-400">{integration.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <ExternalLink size={14} className="mr-1" />
                  Configure
                </Button>
                <Switch
                  checked={integration.enabled}
                  onCheckedChange={integration.onToggle}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys Management */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">API Configuration</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Saber API Key</label>
              <Input 
                type="password" 
                placeholder="••••••••••••••••" 
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Concur Client ID</label>
              <Input 
                type="text" 
                placeholder="Enter Client ID" 
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Save API Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};