
import React, { useState } from 'react';
import { Users, MessageCircle, Calendar, Search, Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface NetworkingHubProps {
  eventId: string;
  userRole: 'organizer' | 'speaker' | 'exhibitor' | 'attendee';
}

interface NetworkingProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  interests: string[];
  lookingFor: string[];
  matchScore: number;
  isConnected: boolean;
  location?: string;
}

export const NetworkingHub = ({ eventId, userRole }: NetworkingHubProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Mock networking data
  const suggestedConnections: NetworkingProfile[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'VP of Product',
      company: 'TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=60&h=60&fit=crop&crop=face',
      interests: ['Product Strategy', 'AI/ML', 'Team Building'],
      lookingFor: ['Funding', 'Partnerships', 'Mentorship'],
      matchScore: 95,
      isConnected: false,
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      title: 'Founder & CEO',
      company: 'StartupXYZ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      interests: ['Fintech', 'Blockchain', 'Scaling'],
      lookingFor: ['Investors', 'Technical Co-founder', 'Advisors'],
      matchScore: 87,
      isConnected: false,
      location: 'New York, NY'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      title: 'Research Director',
      company: 'Innovation Labs',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
      interests: ['Research', 'Healthcare Tech', 'Innovation'],
      lookingFor: ['Collaborators', 'Research Partners', 'Funding'],
      matchScore: 78,
      isConnected: true,
      location: 'Boston, MA'
    }
  ];

  const interestTags = [
    'AI/ML', 'Fintech', 'Healthcare', 'SaaS', 'Mobile', 'Blockchain',
    'Product Strategy', 'Marketing', 'Sales', 'Fundraising', 'Partnerships'
  ];

  const meetings = [
    {
      id: '1',
      person: 'Sarah Chen',
      time: 'Today 2:00 PM',
      location: 'Coffee Lounge',
      status: 'confirmed'
    },
    {
      id: '2',
      person: 'Marcus Johnson',
      time: 'Tomorrow 10:30 AM',
      location: 'Networking Area',
      status: 'pending'
    }
  ];

  const handleConnect = (profileId: string) => {
    // Handle connection logic
    console.log('Connecting with:', profileId);
  };

  const handleScheduleMeeting = (profileId: string) => {
    // Handle meeting scheduling
    console.log('Scheduling meeting with:', profileId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users size={24} className="text-blue-400" />
        <div>
          <h2 className="text-xl font-semibold text-white">Networking Hub</h2>
          <p className="text-gray-400 text-sm">Connect with attendees and schedule meetings</p>
        </div>
      </div>

      <Tabs defaultValue="discover" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="discover" className="text-gray-300 data-[state=active]:text-white">
            Discover
          </TabsTrigger>
          <TabsTrigger value="connections" className="text-gray-300 data-[state=active]:text-white">
            My Connections
          </TabsTrigger>
          <TabsTrigger value="meetings" className="text-gray-300 data-[state=active]:text-white">
            Meetings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search attendees by name, company, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Filter by interests:</label>
              <div className="flex flex-wrap gap-2">
                {interestTags.map(tag => (
                  <Button
                    key={tag}
                    size="sm"
                    variant={selectedInterests.includes(tag) ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedInterests(prev =>
                        prev.includes(tag)
                          ? prev.filter(i => i !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={
                      selectedInterests.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'border-gray-600 text-gray-300'
                    }
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* AI-Matched Connections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star size={20} className="text-yellow-400" />
              AI-Recommended Connections
            </h3>

            <div className="grid gap-4">
              {suggestedConnections.map(profile => (
                <Card key={profile.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-semibold">{profile.name}</h4>
                            <Badge className="bg-green-500/20 text-green-400 text-xs">
                              {profile.matchScore}% match
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm">{profile.title} at {profile.company}</p>
                          {profile.location && (
                            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                              <MapPin size={12} />
                              <span>{profile.location}</span>
                            </div>
                          )}

                          <div className="mt-3 space-y-2">
                            <div>
                              <span className="text-xs font-medium text-gray-400">Interests:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profile.interests.map(interest => (
                                  <Badge key={interest} className="bg-blue-500/20 text-blue-400 text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-400">Looking for:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profile.lookingFor.map(item => (
                                  <Badge key={item} className="bg-purple-500/20 text-purple-400 text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {!profile.isConnected ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleConnect(profile.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Connect
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleScheduleMeeting(profile.id)}
                              className="border-gray-600 text-gray-300"
                            >
                              <Calendar size={14} className="mr-1" />
                              Meet
                            </Button>
                          </>
                        ) : (
                          <>
                            <Badge className="bg-green-500/20 text-green-400 text-xs justify-center">
                              Connected
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300"
                            >
                              <MessageCircle size={14} className="mr-1" />
                              Message
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <div className="text-center py-8">
            <Users size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No connections yet</h3>
            <p className="text-gray-500 text-sm">Start connecting with other attendees to build your network</p>
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Scheduled Meetings</h3>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Schedule New Meeting
              </Button>
            </div>

            {meetings.map(meeting => (
              <Card key={meeting.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{meeting.person}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{meeting.location}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      meeting.status === 'confirmed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }>
                      {meeting.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
