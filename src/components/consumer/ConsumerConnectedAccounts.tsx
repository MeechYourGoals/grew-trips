import React, { useState } from 'react';
import { Link, CheckCircle, AlertCircle, Plus, Settings, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ConnectedAccount {
  id: string;
  service: string;
  type: 'travel' | 'payment' | 'communication' | 'calendar' | 'social';
  email: string;
  status: 'connected' | 'disconnected' | 'error';
  permissions: string[];
  lastUsed: string;
  icon: string;
}

export const ConsumerConnectedAccounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    {
      id: '1',
      service: 'Google',
      type: 'calendar',
      email: user?.email || 'demo@example.com',
      status: 'connected',
      permissions: ['calendar.read', 'calendar.write'],
      lastUsed: '2024-01-15T10:30:00Z',
      icon: '🟢'
    },
    {
      id: '2',
      service: 'Stripe',
      type: 'payment',
      email: user?.email || 'demo@example.com',
      status: 'connected',
      permissions: ['payment.read', 'payment.write'],
      lastUsed: '2024-01-14T15:45:00Z',
      icon: '💳'
    },
    {
      id: '3',
      service: 'Booking.com',
      type: 'travel',
      email: user?.email || 'demo@example.com',
      status: 'error',
      permissions: ['bookings.read'],
      lastUsed: '2024-01-10T08:20:00Z',
      icon: '🏨'
    }
  ]);

  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'travel': return 'text-blue-400';
      case 'payment': return 'text-green-400';
      case 'communication': return 'text-purple-400';
      case 'calendar': return 'text-orange-400';
      case 'social': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'travel': return 'Travel Service';
      case 'payment': return 'Payment Service';
      case 'communication': return 'Communication';
      case 'calendar': return 'Calendar Service';
      case 'social': return 'Social Media';
      default: return 'Service';
    }
  };

  const handleConnect = async (service: string) => {
    setIsConnecting(service);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(null);
    }, 2000);
  };

  const handleDisconnect = (accountId: string) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
  };

  const handleRefresh = (accountId: string) => {
    setAccounts(accounts.map(acc => 
      acc.id === accountId 
        ? { ...acc, status: 'connected', lastUsed: new Date().toISOString() }
        : acc
    ));
  };

  const availableServices = [
    { name: 'Expedia', type: 'travel', icon: '✈️' },
    { name: 'Airbnb', type: 'travel', icon: '🏠' },
    { name: 'Uber', type: 'travel', icon: '🚗' },
    { name: 'PayPal', type: 'payment', icon: '💰' },
    { name: 'Outlook', type: 'calendar', icon: '📅' },
    { name: 'Apple Calendar', type: 'calendar', icon: '🍎' },
    { name: 'Slack', type: 'communication', icon: '💬' },
    { name: 'Discord', type: 'communication', icon: '🎮' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
        <Link size={24} className="text-glass-orange" />
        Connected Accounts
      </h3>

      {/* Connected Accounts List */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Your Connected Services</h4>
        
        {accounts.length === 0 ? (
          <div className="text-center py-8">
            <Link size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No accounts connected yet</p>
            <p className="text-sm text-gray-500">Connect your accounts to enhance your travel planning experience</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{account.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{account.service}</span>
                      <span className={`text-xs px-2 py-1 rounded-full bg-white/10 ${getTypeColor(account.type)}`}>
                        {getTypeLabel(account.type)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">{account.email}</div>
                    <div className="text-xs text-gray-500">
                      Last used: {new Date(account.lastUsed).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {account.status === 'connected' && (
                    <CheckCircle size={20} className="text-green-400" />
                  )}
                  {account.status === 'error' && (
                    <AlertCircle size={20} className="text-red-400" />
                  )}
                  
                  <button
                    onClick={() => handleRefresh(account.id)}
                    className="text-gray-400 hover:text-glass-orange p-1 rounded transition-colors"
                  >
                    <RefreshCw size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleDisconnect(account.id)}
                    className="text-gray-400 hover:text-red-400 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Services */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Available Services</h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableServices.map((service) => (
            <button
              key={service.name}
              onClick={() => handleConnect(service.name)}
              disabled={isConnecting === service.name || accounts.some(acc => acc.service === service.name)}
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 disabled:opacity-50 rounded-lg transition-colors"
            >
              <span className="text-2xl">{service.icon}</span>
              <div className="text-left">
                <div className="text-white font-medium">{service.name}</div>
                <div className={`text-sm ${getTypeColor(service.type)}`}>
                  {getTypeLabel(service.type)}
                </div>
                <div className="text-xs text-gray-400">
                  {isConnecting === service.name ? 'Connecting...' : 
                   accounts.some(acc => acc.service === service.name) ? 'Connected' : 'Connect'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Security & Permissions */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-glass-orange" />
          Security & Permissions
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-gray-400">Require 2FA for sensitive account connections</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Auto-refresh Tokens</div>
              <div className="text-sm text-gray-400">Automatically refresh expired connection tokens</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Permission Notifications</div>
              <div className="text-sm text-gray-400">Get notified when services request new permissions</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
          
          <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-white font-medium">Review All Permissions</div>
              <div className="text-sm text-gray-400">See what data each connected service can access</div>
            </div>
            <div className="text-glass-orange">Review</div>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors">
            <div className="text-left">
              <div className="text-red-400 font-medium">Disconnect All Accounts</div>
              <div className="text-sm text-gray-400">Remove all connected services at once</div>
            </div>
            <div className="text-red-400">Disconnect All</div>
          </button>
        </div>
      </div>
    </div>
  );
};