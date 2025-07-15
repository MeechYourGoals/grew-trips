import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calendar, ExternalLink, Settings, Download } from 'lucide-react';
import { Badge } from '../ui/badge';
import { CalendarEvent } from '../../types/calendar';
import { calendarExporter } from '../../utils/calendarExport';
import { useToast } from '../../hooks/use-toast';

interface CalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripName: string;
  events: CalendarEvent[];
}

interface CalendarProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  connected: boolean;
  syncEnabled: boolean;
}

export const CalendarSyncModal: React.FC<CalendarSyncModalProps> = ({
  isOpen,
  onClose,
  tripName,
  events
}) => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<CalendarProvider[]>([
    {
      id: 'google',
      name: 'Google Calendar',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-blue-500',
      description: 'Sync with your Google Calendar',
      connected: false,
      syncEnabled: false
    },
    {
      id: 'outlook',
      name: 'Outlook Calendar',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-blue-600',
      description: 'Sync with Microsoft Outlook',
      connected: false,
      syncEnabled: false
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-gray-800',
      description: 'Sync with Apple Calendar',
      connected: false,
      syncEnabled: false
    }
  ]);

  const handleConnect = async (providerId: string) => {
    // This would normally trigger OAuth flow
    toast({
      title: 'API Key Required',
      description: `Please configure ${providerId} Calendar API credentials in your environment.`,
      variant: 'destructive'
    });
  };

  const handleSyncToggle = (providerId: string, enabled: boolean) => {
    setProviders(prev => prev.map(provider => 
      provider.id === providerId 
        ? { ...provider, syncEnabled: enabled }
        : provider
    ));
  };

  const handleExportICS = () => {
    calendarExporter.downloadICS(events, tripName);
    toast({
      title: 'Calendar Exported',
      description: 'Your trip calendar has been downloaded as an ICS file.'
    });
  };

  const handleQuickAdd = (event: CalendarEvent) => {
    const urls = calendarExporter.generateCalendarUrls(event);
    // Open Google Calendar by default
    window.open(urls.google, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendar Sync & Export
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Export */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Export</CardTitle>
              <CardDescription>
                Download your trip calendar or add events to your calendar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleExportICS} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download ICS File
                </Button>
                <Button 
                  onClick={() => handleQuickAdd(events[0])}
                  variant="outline"
                  disabled={events.length === 0}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Add to Google Calendar
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {events.length} events ready to export
              </p>
            </CardContent>
          </Card>

          {/* Calendar Providers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Calendar Integrations</h3>
            {providers.map((provider) => (
              <Card key={provider.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${provider.color} text-white`}>
                        {provider.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{provider.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {provider.connected ? (
                        <>
                          <Badge variant="secondary">Connected</Badge>
                          <Switch
                            checked={provider.syncEnabled}
                            onCheckedChange={(checked) => 
                              handleSyncToggle(provider.id, checked)
                            }
                          />
                        </>
                      ) : (
                        <Button
                          onClick={() => handleConnect(provider.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sync Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sync Settings</CardTitle>
              <CardDescription>
                Control how your trip events are synchronized
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Auto-sync new events</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Sync event updates</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Include private events</span>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};