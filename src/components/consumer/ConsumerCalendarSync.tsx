import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, RefreshCw, Settings, Download, Upload } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../integrations/supabase/client';

interface CalendarConnection {
  id: string;
  type: 'google' | 'outlook' | 'apple';
  email: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  autoSync: boolean;
}

export const ConsumerCalendarSync = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Mock data - would come from your backend
  const mockConnections: CalendarConnection[] = [
    {
      id: '1',
      type: 'google',
      email: user?.email || 'demo@example.com',
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z',
      autoSync: true
    }
  ];

  useEffect(() => {
    setConnections(mockConnections);
  }, [user]);

  const handleConnect = async (type: 'google' | 'outlook' | 'apple') => {
    setIsConnecting(type);
    
    try {
      // Call the calendar sync edge function
      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: { 
          action: 'connect',
          provider: type
        }
      });

      if (error) throw error;

      // Update connection status
      const newConnection: CalendarConnection = {
        id: Date.now().toString(),
        type,
        email: user?.email || 'demo@example.com',
        status: 'connected',
        lastSync: new Date().toISOString(),
        autoSync: true
      };

      setConnections([...connections, newConnection]);
    } catch (error) {
      console.error('Calendar connection error:', error);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    setConnections(connections.filter(conn => conn.id !== connectionId));
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: { action: 'sync' }
      });

      if (error) throw error;

      // Update last sync time
      setConnections(connections.map(conn => ({
        ...conn,
        lastSync: new Date().toISOString()
      })));
    } catch (error) {
      console.error('Calendar sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'google': return '🟢';
      case 'outlook': return '🔷';
      case 'apple': return '🍎';
      default: return '📅';
    }
  };

  const getProviderName = (type: string) => {
    switch (type) {
      case 'google': return 'Google Calendar';
      case 'outlook': return 'Outlook Calendar';
      case 'apple': return 'Apple Calendar';
      default: return 'Calendar';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar size={24} className="text-glass-orange" />
          Calendar Sync
        </h3>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-glass-orange hover:bg-glass-orange/80 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Connected Calendars</h4>
        
        {connections.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No calendars connected yet</p>
            <p className="text-sm text-gray-500">Connect your calendar to automatically sync your travel plans</p>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getProviderIcon(connection.type)}</span>
                  <div>
                    <div className="text-white font-medium">{getProviderName(connection.type)}</div>
                    <div className="text-sm text-gray-400">{connection.email}</div>
                    <div className="text-xs text-gray-500">
                      Last sync: {new Date(connection.lastSync).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {connection.status === 'connected' && (
                    <CheckCircle size={20} className="text-green-400" />
                  )}
                  {connection.status === 'error' && (
                    <AlertCircle size={20} className="text-red-400" />
                  )}
                  
                  <button
                    onClick={() => handleDisconnect(connection.id)}
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

      {/* Connect New Calendar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Connect New Calendar</h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { type: 'google', name: 'Google Calendar', icon: '🟢' },
            { type: 'outlook', name: 'Outlook Calendar', icon: '🔷' },
            { type: 'apple', name: 'Apple Calendar', icon: '🍎' }
          ].map((provider) => (
            <button
              key={provider.type}
              onClick={() => handleConnect(provider.type as any)}
              disabled={isConnecting === provider.type || connections.some(c => c.type === provider.type)}
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 disabled:opacity-50 rounded-lg transition-colors"
            >
              <span className="text-2xl">{provider.icon}</span>
              <div className="text-left">
                <div className="text-white font-medium">{provider.name}</div>
                <div className="text-sm text-gray-400">
                  {isConnecting === provider.type ? 'Connecting...' : 
                   connections.some(c => c.type === provider.type) ? 'Connected' : 'Connect'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sync Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Sync Settings</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Auto-sync Events</div>
              <div className="text-sm text-gray-400">Automatically sync travel events to your calendar</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Two-way Sync</div>
              <div className="text-sm text-gray-400">Sync changes both ways between ravel and your calendar</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-gray-600">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Notifications</div>
              <div className="text-sm text-gray-400">Get notified when events are synced</div>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-glass-orange">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Export/Import */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Calendar Export/Import</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <Download size={20} className="text-glass-orange" />
            <div className="text-left">
              <div className="text-white font-medium">Export Calendar</div>
              <div className="text-sm text-gray-400">Download your travel calendar as .ics file</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <Upload size={20} className="text-glass-orange" />
            <div className="text-left">
              <div className="text-white font-medium">Import Calendar</div>
              <div className="text-sm text-gray-400">Import events from .ics file</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};