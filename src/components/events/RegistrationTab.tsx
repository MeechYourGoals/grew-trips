
import React from 'react';
import { Users, UserCheck, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
          <p className="text-gray-400 text-sm">Real-time attendance tracking</p>
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
    </div>
  );
};