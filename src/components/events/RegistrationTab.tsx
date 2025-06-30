
import React, { useState } from 'react';
import { QrCode, Users, UserCheck, Clock, MapPin, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface RegistrationTabProps {
  eventId: string;
  capacity: number;
  registeredCount: number;
  checkedInCount: number;
  registrationStatus: 'open' | 'closed' | 'waitlist';
  userRole: 'organizer' | 'speaker' | 'exhibitor' | 'attendee';
}

export const RegistrationTab = ({
  eventId,
  capacity,
  registeredCount,
  checkedInCount,
  registrationStatus,
  userRole
}: RegistrationTabProps) => {
  const [showQRCode, setShowQRCode] = useState(false);

  const registrationPercentage = (registeredCount / capacity) * 100;
  const checkinPercentage = checkedInCount > 0 ? (checkedInCount / registeredCount) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'waitlist': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <UserCheck size={24} className="text-blue-400" />
        <div>
          <h2 className="text-xl font-semibold text-white">Registration & Check-in</h2>
          <p className="text-gray-400 text-sm">Real-time attendance tracking and badge management</p>
        </div>
      </div>

      {/* Registration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Users size={16} />
              Total Registered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{registeredCount.toLocaleString()}</div>
            <p className="text-xs text-gray-500">of {capacity.toLocaleString()} capacity</p>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <UserCheck size={16} />
              Checked In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{checkedInCount.toLocaleString()}</div>
            <p className="text-xs text-gray-500">{checkinPercentage.toFixed(1)}% of registered</p>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${checkinPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock size={16} />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${getStatusColor(registrationStatus)} text-white text-sm px-3 py-1`}>
              {registrationStatus.toUpperCase()}
            </Badge>
            <p className="text-xs text-gray-500 mt-2">
              {registrationStatus === 'open' && 'Accepting new registrations'}
              {registrationStatus === 'waitlist' && 'New registrations on waitlist'}
              {registrationStatus === 'closed' && 'Registration has ended'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Badge */}
      {userRole === 'attendee' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <QrCode size={20} />
              Your Event Badge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 mb-2">
                  Use this QR code for event check-in and networking
                </p>
                <Button 
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {showQRCode ? 'Hide Badge' : 'Show QR Badge'}
                </Button>
              </div>
              {showQRCode && (
                <div className="bg-white p-4 rounded-lg">
                  <div className="w-32 h-32 bg-gray-900 rounded flex items-center justify-center">
                    <QrCode size={80} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Check-in Feed (Organizer only) */}
      {userRole === 'organizer' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp size={20} />
              Live Check-in Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Sarah Johnson', role: 'Speaker', time: '2 minutes ago', vip: true },
                { name: 'Michael Chen', role: 'Attendee', time: '3 minutes ago', vip: false },
                { name: 'Jessica Martinez', role: 'Exhibitor', time: '5 minutes ago', vip: false },
                { name: 'Dr. Robert Kim', role: 'Keynote Speaker', time: '8 minutes ago', vip: true }
              ].map((checkin, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{checkin.name}</span>
                        {checkin.vip && <Badge className="bg-yellow-500 text-black text-xs">VIP</Badge>}
                      </div>
                      <span className="text-gray-400 text-sm">{checkin.role}</span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">{checkin.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Heat Map */}
      {userRole === 'organizer' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin size={20} />
              Venue Heat Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 h-48">
              {[...Array(16)].map((_, i) => {
                const density = Math.random();
                return (
                  <div
                    key={i}
                    className={`rounded ${
                      density > 0.7 ? 'bg-red-500/60' :
                      density > 0.4 ? 'bg-yellow-500/60' :
                      density > 0.2 ? 'bg-green-500/60' :
                      'bg-gray-600/60'
                    }`}
                  ></div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <span>Low Density</span>
              <span>High Density</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
