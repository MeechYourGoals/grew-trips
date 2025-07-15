import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, Mail, MessageSquare, Calendar, Users, CreditCard } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'push' | 'email' | 'sms';
  enabled: boolean;
  premium?: boolean;
}

export const NotificationPreferences: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'trip_updates',
      label: 'Trip Updates',
      description: 'Notifications about changes to your trip itinerary',
      icon: <Calendar className="w-4 h-4" />,
      category: 'push',
      enabled: true
    },
    {
      id: 'chat_messages',
      label: 'Chat Messages',
      description: 'New messages in your trip chat',
      icon: <MessageSquare className="w-4 h-4" />,
      category: 'push',
      enabled: true
    },
    {
      id: 'team_updates',
      label: 'Team Updates',
      description: 'When team members join or leave',
      icon: <Users className="w-4 h-4" />,
      category: 'push',
      enabled: false
    },
    {
      id: 'payment_alerts',
      label: 'Payment Alerts',
      description: 'Expense sharing and payment requests',
      icon: <CreditCard className="w-4 h-4" />,
      category: 'push',
      enabled: true,
      premium: true
    },
    {
      id: 'email_digest',
      label: 'Daily Digest',
      description: 'Summary of trip activity via email',
      icon: <Mail className="w-4 h-4" />,
      category: 'email',
      enabled: false
    },
    {
      id: 'calendar_reminders',
      label: 'Calendar Reminders',
      description: 'Reminders for upcoming events',
      icon: <Bell className="w-4 h-4" />,
      category: 'push',
      enabled: true
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  });

  const handleSettingChange = (settingId: string, enabled: boolean) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId ? { ...setting, enabled } : setting
    ));
  };

  const handleGlobalSettingChange = (key: string, value: boolean) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    // This would normally save to the database
    toast({
      title: 'Preferences Saved',
      description: 'Your notification preferences have been updated.'
    });
  };

  const testNotification = async () => {
    // This would normally trigger a test notification
    toast({
      title: 'Test Notification Sent',
      description: 'Check your device for the test notification.'
    });
  };

  const categoryGroups = {
    push: settings.filter(s => s.category === 'push'),
    email: settings.filter(s => s.category === 'email'),
    sms: settings.filter(s => s.category === 'sms')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
          <p className="text-muted-foreground">
            Control how and when you receive notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={testNotification} variant="outline">
            Test Notification
          </Button>
          <Button onClick={savePreferences}>
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
          <CardDescription>
            Master controls for all notification types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <Switch
              checked={globalSettings.pushEnabled}
              onCheckedChange={(checked) => 
                handleGlobalSettingChange('pushEnabled', checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={globalSettings.emailEnabled}
              onCheckedChange={(checked) => 
                handleGlobalSettingChange('emailEnabled', checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications via text message
              </p>
              <Badge variant="outline" className="mt-1">Premium</Badge>
            </div>
            <Switch
              checked={globalSettings.smsEnabled}
              onCheckedChange={(checked) => 
                handleGlobalSettingChange('smsEnabled', checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Quiet Hours</p>
              <p className="text-sm text-muted-foreground">
                Disable notifications during specified hours
              </p>
            </div>
            <Switch
              checked={globalSettings.quietHours}
              onCheckedChange={(checked) => 
                handleGlobalSettingChange('quietHours', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Instant notifications on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryGroups.push.map(setting => (
            <div key={setting.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {setting.icon}
                <div>
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                {setting.premium && (
                  <Badge variant="secondary">Premium</Badge>
                )}
              </div>
              <Switch
                checked={setting.enabled}
                onCheckedChange={(checked) => 
                  handleSettingChange(setting.id, checked)
                }
                disabled={!globalSettings.pushEnabled}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Notifications sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryGroups.email.map(setting => (
            <div key={setting.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {setting.icon}
                <div>
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={setting.enabled}
                onCheckedChange={(checked) => 
                  handleSettingChange(setting.id, checked)
                }
                disabled={!globalSettings.emailEnabled}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Device Status */}
      <Card>
        <CardHeader>
          <CardTitle>Device Status</CardTitle>
          <CardDescription>
            Current notification permissions and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Browser Notifications</span>
            <Badge variant="outline">Granted</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Push Token</span>
            <Badge variant="secondary">Registered</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Last Sync</span>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};