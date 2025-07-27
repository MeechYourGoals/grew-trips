
import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, FileText, Star, Sparkles, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Track, Session, Speaker } from '../../types/events';

interface AgendaBuilderProps {
  tracks: Track[];
  sessions: Session[];
  speakers: Speaker[];
  userRole: 'organizer' | 'speaker' | 'exhibitor' | 'attendee';
}

export const AgendaBuilder = ({ tracks, sessions, speakers, userRole }: AgendaBuilderProps) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [addedSessions, setAddedSessions] = useState<Set<string>>(new Set(['1', '3'])); // Pre-selected sessions for demo

  const handleAddToAgenda = (sessionId: string) => {
    const newAdded = new Set(addedSessions);
    if (newAdded.has(sessionId)) {
      newAdded.delete(sessionId);
    } else {
      newAdded.add(sessionId);
    }
    setAddedSessions(newAdded);
  };

  const filteredSessions = selectedTrack === 'all' 
    ? sessions 
    : sessions.filter(session => session.track === selectedTrack);

  // Mock sessions data
  const mockSessions = [
    {
      id: '1',
      title: 'Future of AI in Web Development',
      description: 'Exploring how artificial intelligence is transforming modern web development practices.',
      startTime: '09:00',
      endTime: '10:00',
      location: 'Main Auditorium',
      track: 'tech',
      speaker: '1',
      capacity: 200,
      rsvpCount: 145,
      materials: [{ title: 'Slides', type: 'pdf' }]
    },
    {
      id: '2',
      title: 'Building Scalable React Applications',
      description: 'Best practices for architecting large-scale React applications with performance in mind.',
      startTime: '10:30',
      endTime: '11:30',
      location: 'Conference Room A',
      track: 'tech',
      speaker: '2',
      capacity: 100,
      rsvpCount: 87,
      materials: []
    },
    {
      id: '3',
      title: 'Design Systems for Modern Apps',
      description: 'Creating consistent and maintainable design systems for enterprise applications.',
      startTime: '14:00',
      endTime: '15:00',
      location: 'Workshop Room',
      track: 'design',
      speaker: '3',
      capacity: 50,
      rsvpCount: 38,
      materials: [{ title: 'Design Kit', type: 'figma' }]
    },
    {
      id: '4',
      title: 'Product Strategy in 2024',
      description: 'Strategic approaches to product development in an evolving market landscape.',
      startTime: '15:30',
      endTime: '16:30',
      location: 'Main Auditorium',
      track: 'business',
      speaker: '4',
      capacity: 200,
      rsvpCount: 156,
      materials: []
    }
  ];

  const allSessions = mockSessions.length > 0 ? mockSessions : filteredSessions;

  const getSpeaker = (speakerId: string) => 
    speakers.find(speaker => speaker.id === speakerId);

  const getTrack = (trackId: string) => 
    tracks.find(track => track.id === trackId);

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar size={24} className="text-blue-400" />
        <div>
          <h2 className="text-xl font-semibold text-white">Event Agenda</h2>
          <p className="text-gray-400 text-sm">Browse sessions and build your personal agenda</p>
        </div>
      </div>

      <Tabs defaultValue="agenda" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="agenda" className="text-gray-300 data-[state=active]:text-white">
            All Sessions
          </TabsTrigger>
          <TabsTrigger value="my-schedule" className="text-gray-300 data-[state=active]:text-white">
            My Agenda
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="space-y-4">
          {/* Track Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTrack === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTrack('all')}
              className={selectedTrack === 'all' ? 'bg-blue-600 text-white' : 'border-gray-600 text-gray-300'}
            >
              All Sessions
            </Button>
            {tracks.map(track => (
              <Button
                key={track.id}
                variant={selectedTrack === track.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTrack(track.id)}
                className={selectedTrack === track.id ? 'bg-blue-600 text-white' : 'border-gray-600 text-gray-300'}
                style={selectedTrack === track.id ? { backgroundColor: track.color } : {}}
              >
                {track.name}
              </Button>
            ))}
          </div>

          {/* Sessions Grid */}
          <div className="grid gap-4">
            {allSessions.map(session => {
              const speaker = getSpeaker(session.speaker);
              const track = getTrack(session.track);
              const isAdded = addedSessions.has(session.id);
              const isNearCapacity = session.rsvpCount / session.capacity > 0.8;

              return (
                <Card key={session.id} className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            className="text-xs px-2 py-1" 
                            style={{ backgroundColor: track?.color, color: 'white' }}
                          >
                            {track?.name}
                          </Badge>
                          {isNearCapacity && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                              Nearly Full
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-white text-lg">{session.title}</CardTitle>
                        <p className="text-gray-400 text-sm mt-1">{session.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={isAdded ? 'default' : 'outline'}
                        onClick={() => handleAddToAgenda(session.id)}
                        className={isAdded ? 'bg-green-600 text-white' : 'border-gray-600 text-gray-300'}
                      >
                        {isAdded ? '✓ Added' : '+ Add'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock size={16} />
                        <span className="text-sm">
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin size={16} />
                        <span className="text-sm">{session.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Users size={16} />
                        <span className="text-sm">
                          {session.rsvpCount}/{session.capacity} registered
                        </span>
                      </div>
                    </div>

                    {speaker && (
                      <div className="flex items-center gap-3 mt-4 p-3 bg-gray-700/50 rounded-lg">
                        <img
                          src={speaker.avatar}
                          alt={speaker.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="text-white font-medium">{speaker.name}</div>
                          <div className="text-gray-400 text-sm">{speaker.title} at {speaker.company}</div>
                        </div>
                      </div>
                    )}

                    {session.materials && session.materials.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 text-gray-300 mb-2">
                          <FileText size={16} />
                          <span className="text-sm font-medium">Session Materials</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {session.materials.map((material, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 text-xs"
                            >
                              {material.title}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>


        <TabsContent value="my-schedule" className="space-y-4">
          {addedSessions.size === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No sessions in your schedule</h3>
                <p className="text-gray-500 text-sm">Add sessions to build your personal agenda</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {allSessions
                .filter(session => addedSessions.has(session.id))
                .map(session => {
                  const speaker = getSpeaker(session.speaker);
                  const track = getTrack(session.track);
                  
                  return (
                    <Card key={session.id} className="bg-gray-800/50 border-gray-700 border-l-4" 
                          style={{ borderLeftColor: track?.color }}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold">{session.title}</h3>
                          <Badge style={{ backgroundColor: track?.color, color: 'white' }}>
                            {track?.name}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span>{session.location}</span>
                          </div>
                        </div>
                        {speaker && (
                          <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                            <span>with {speaker.name}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
