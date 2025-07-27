import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../hooks/useAuth';

interface Attendee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company?: string;
  bio?: string;
}

interface EnhancedNetworkingHubProps {
  eventId: string;
  attendees: Attendee[];
}

export const EnhancedNetworkingHub = ({ eventId, attendees }: EnhancedNetworkingHubProps) => {
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [optedInAttendees, setOptedInAttendees] = useState<Attendee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Mock opted-in attendees data
    setOptedInAttendees([
      {
        id: '1',
        name: 'Sarah Martinez',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
        role: 'Product Manager',
        company: 'TechCorp Inc.',
        bio: 'Passionate about building products that solve real problems. 8 years in tech product management.'
      },
      {
        id: '2',
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'Software Engineer',
        company: 'StartupXYZ',
        bio: 'Full-stack developer specializing in React and Node.js. Love discussing new technologies and best practices.'
      },
      {
        id: '3',
        name: 'Jessica Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'UX Designer',
        company: 'Design Studio',
        bio: 'Creating intuitive user experiences for mobile and web. Always excited to connect with fellow designers.'
      }
    ]);
  }, [eventId]);

  const toggleOptIn = () => {
    if (!user) {
      const name = prompt('Please enter your name:');
      const jobTitle = prompt('Please enter your job title:');
      const bio = prompt('Please enter a short bio:');
      
      if (!name || !jobTitle || !bio) return;

      setIsOptedIn(true);
      const newAttendee: Attendee = {
        id: Date.now().toString(),
        name,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
        role: jobTitle,
        company: 'Event Attendee',
        bio
      };
      setOptedInAttendees(prev => [newAttendee, ...prev]);
      
      toast({
        title: "Added to directory",
        description: "You now appear in the attendee directory."
      });
    } else {
      setIsOptedIn(!isOptedIn);
      
      if (!isOptedIn) {
        const newAttendee: Attendee = {
          id: user.id,
          name: user.email?.split('@')[0] || 'Anonymous',
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
          role: 'Event Attendee',
          company: 'Tech Professional',
          bio: 'Excited to network and learn at this event!'
        };
        setOptedInAttendees(prev => [newAttendee, ...prev]);
        
        toast({
          title: "Added to directory",
          description: "You now appear in the attendee directory."
        });
      } else {
        setOptedInAttendees(prev => prev.filter(a => a.id !== user.id));
        toast({
          title: "Removed from directory",
          description: "You no longer appear in the attendee directory."
        });
      }
    }
  };

  const filteredAttendees = optedInAttendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users size={24} className="text-glass-orange" />
        <h3 className="text-xl font-bold text-white">Networking Hub</h3>
      </div>

      {/* Opt-in Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-white font-medium mb-2">Attendee Directory</h4>
        <p className="text-gray-400 text-sm mb-4">
          Opt-in to appear in the attendee directory. Share your name, job, and bio.
        </p>
        
        <Button
          onClick={toggleOptIn}
          className={`${
            isOptedIn 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-glass-orange hover:bg-glass-orange/80 text-white'
          }`}
        >
          <UserPlus size={16} className="mr-2" />
          {isOptedIn ? 'Remove from Directory' : 'Appear in Directory'}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search attendees..."
          className="pl-10 bg-gray-800/50 border-gray-600 text-white"
        />
      </div>

      {/* Attendee Directory */}
      <div className="space-y-4">
        {filteredAttendees.map((attendee) => (
          <div key={attendee.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex gap-4">
              <img
                src={attendee.avatar}
                alt={attendee.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="text-white font-semibold text-lg mb-1">{attendee.name}</h4>
                <p className="text-glass-orange text-sm font-medium mb-2">{attendee.role}</p>
                {attendee.company && (
                  <p className="text-gray-400 text-sm mb-2">{attendee.company}</p>
                )}
                {attendee.bio && (
                  <p className="text-gray-300 text-sm">{attendee.bio}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAttendees.length === 0 && (
          <div className="text-center py-8">
            <Users size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No attendees in the directory yet.</p>
            <p className="text-gray-500 text-sm mt-2">Be the first to opt-in and start networking!</p>
          </div>
        )}
      </div>
    </div>
  );
};