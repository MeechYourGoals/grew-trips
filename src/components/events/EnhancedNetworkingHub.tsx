import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, UserPlus, Filter, Search, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../hooks/useAuth';

interface Attendee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company?: string;
  bio?: string;
  interests?: string[];
  matchScore?: number;
}

interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  requester_name: string;
  recipient_name: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  created_at: string;
}

interface EnhancedNetworkingHubProps {
  eventId: string;
  attendees: Attendee[];
}

export const EnhancedNetworkingHub = ({ eventId, attendees }: EnhancedNetworkingHubProps) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'discover' | 'connections'>('discover');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Mock connections data
      setConnections([
        {
          id: '1',
          requester_id: 'user1',
          recipient_id: user.id,
          requester_name: 'John Doe',
          recipient_name: user.email?.split('@')[0] || 'You',
          status: 'pending',
          message: 'Would love to connect about AI innovations!',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          requester_id: user.id,
          recipient_id: 'user2',
          requester_name: user.email?.split('@')[0] || 'You',
          recipient_name: 'Jane Smith',
          status: 'accepted',
          created_at: new Date().toISOString()
        }
      ]);
      setIsLoading(false);
    }
  }, [user, eventId]);

  const fetchConnections = async () => {
    // Mock implementation
    console.log('Fetching connections for event:', eventId);
  };

  const sendConnectionRequest = async (recipientId: string, recipientName: string, message?: string) => {
    if (!user) return;

    try {
      const newConnection: Connection = {
        id: Date.now().toString(),
        requester_id: user.id,
        recipient_id: recipientId,
        requester_name: user.email?.split('@')[0] || 'Anonymous',
        recipient_name: recipientName,
        status: 'pending',
        message: message || '',
        created_at: new Date().toISOString()
      };
      
      setConnections(prev => [newConnection, ...prev]);
      
      toast({
        title: "Connection request sent",
        description: `Your request to connect with ${recipientName} has been sent.`
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request.",
        variant: "destructive"
      });
    }
  };

  const respondToConnection = async (connectionId: string, status: 'accepted' | 'declined') => {
    try {
      setConnections(prev => prev.map(c => 
        c.id === connectionId ? { ...c, status } : c
      ));
      
      toast({
        title: status === 'accepted' ? "Connection accepted" : "Connection declined",
        description: `You have ${status} the connection request.`
      });
    } catch (error) {
      console.error('Error responding to connection:', error);
    }
  };

  const calculateMatchScore = (attendee: Attendee): number => {
    // Simple matching algorithm based on interests and role
    let score = 0.5; // Base score
    
    // Role compatibility boost
    if (attendee.role !== 'attendee') score += 0.2;
    
    // Random factor for demo purposes
    score += Math.random() * 0.3;
    
    return Math.min(score, 1.0);
  };

  const getConnectionStatus = (attendeeId: string): 'none' | 'pending' | 'connected' | 'declined' => {
    const connection = connections.find(c => 
      (c.requester_id === attendeeId || c.recipient_id === attendeeId) &&
      (c.requester_id === user?.id || c.recipient_id === user?.id)
    );
    
    if (!connection) return 'none';
    if (connection.status === 'accepted') return 'connected';
    return connection.status as 'pending' | 'declined';
  };

  const filteredAttendees = attendees
    .filter(attendee => attendee.id !== user?.id) // Exclude current user
    .filter(attendee => {
      const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attendee.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attendee.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || attendee.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .map(attendee => ({ ...attendee, matchScore: calculateMatchScore(attendee) }))
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const pendingRequests = connections.filter(c => 
    c.recipient_id === user?.id && c.status === 'pending'
  );

  const myConnections = connections.filter(c => c.status === 'accepted');

  if (!user) {
    return (
      <div className="text-center py-8">
        <Users size={48} className="text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">Please log in to access networking features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users size={24} className="text-glass-orange" />
        <h3 className="text-xl font-bold text-white">Networking Hub</h3>
        {pendingRequests.length > 0 && (
          <Badge variant="secondary" className="bg-glass-orange/20 text-glass-orange">
            {pendingRequests.length} pending
          </Badge>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'discover'
              ? 'bg-glass-orange text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          Discover ({filteredAttendees.length})
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'connections'
              ? 'bg-glass-orange text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          My Network ({myConnections.length})
        </button>
      </div>

      {/* Pending Requests Alert */}
      {pendingRequests.length > 0 && (
        <div className="bg-glass-orange/10 border border-glass-orange/20 rounded-xl p-4 mb-6">
          <h4 className="text-glass-orange font-medium mb-3">
            Pending Connection Requests ({pendingRequests.length})
          </h4>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div>
                  <span className="text-white font-medium">{request.requester_name}</span>
                  {request.message && (
                    <p className="text-gray-400 text-sm mt-1">"{request.message}"</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => respondToConnection(request.id, 'accepted')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => respondToConnection(request.id, 'declined')}
                    className="text-red-400 hover:text-red-300"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {activeTab === 'discover' && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search attendees..."
                className="pl-10 bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40 bg-gray-800/50 border-gray-600 text-white">
              <Filter size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="speaker">Speakers</SelectItem>
              <SelectItem value="exhibitor">Exhibitors</SelectItem>
              <SelectItem value="organizer">Organizers</SelectItem>
              <SelectItem value="attendee">Attendees</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Content */}
      {activeTab === 'discover' && (
        <div className="space-y-4">
          {filteredAttendees.map((attendee) => {
            const connectionStatus = getConnectionStatus(attendee.id);
            return (
              <div key={attendee.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <img
                      src={attendee.avatar}
                      alt={attendee.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold">{attendee.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {attendee.role}
                        </Badge>
                        {attendee.matchScore && attendee.matchScore > 0.7 && (
                          <div className="flex items-center gap-1 text-glass-orange text-sm">
                            <Star size={12} />
                            {Math.round(attendee.matchScore * 100)}% match
                          </div>
                        )}
                      </div>
                      
                      {attendee.company && (
                        <p className="text-gray-400 text-sm mb-2">{attendee.company}</p>
                      )}
                      
                      {attendee.bio && (
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{attendee.bio}</p>
                      )}
                      
                      {attendee.interests && attendee.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {attendee.interests.slice(0, 3).map((interest) => (
                            <span
                              key={interest}
                              className="bg-white/10 text-gray-300 px-2 py-1 rounded-full text-xs"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {connectionStatus === 'none' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const message = prompt('Add a personal message (optional):');
                          sendConnectionRequest(attendee.id, attendee.name, message || undefined);
                        }}
                        className="bg-glass-orange hover:bg-glass-orange/80 text-white"
                      >
                        <UserPlus size={16} className="mr-1" />
                        Connect
                      </Button>
                    )}
                    
                    {connectionStatus === 'pending' && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                        Pending
                      </Badge>
                    )}
                    
                    {connectionStatus === 'connected' && (
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          Connected
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-glass-orange">
                          <MessageSquare size={16} className="mr-1" />
                          Message
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAttendees.length === 0 && (
            <div className="text-center py-8">
              <Users size={48} className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No attendees found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="space-y-4">
          {myConnections.map((connection) => {
            const isRequester = connection.requester_id === user?.id;
            const otherPersonName = isRequester ? connection.recipient_name : connection.requester_name;
            
            return (
              <div key={connection.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-glass-orange/20 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-glass-orange" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{otherPersonName}</h4>
                      <p className="text-gray-400 text-sm">
                        Connected {new Date(connection.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="ghost" className="text-glass-orange">
                    <MessageSquare size={16} className="mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            );
          })}

          {myConnections.length === 0 && (
            <div className="text-center py-8">
              <Users size={48} className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">You haven't made any connections yet.</p>
              <Button onClick={() => setActiveTab('discover')} className="bg-glass-orange hover:bg-glass-orange/80">
                Start Networking
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};