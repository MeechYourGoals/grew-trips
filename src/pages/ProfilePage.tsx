
import React from 'react';
import { User, Archive, Camera, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Trips', value: '12', icon: '✈️' },
    { label: 'Countries Visited', value: '8', icon: '🌍' },
    { label: 'Photos Shared', value: '247', icon: '📸' },
    { label: 'Friends Connected', value: '28', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="bg-gray-800 text-white text-2xl">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <h1 className="text-2xl font-bold mb-1">{user?.email?.split('@')[0] || 'User'}</h1>
        <p className="text-gray-400 mb-4">Travel Enthusiast</p>
        
        <div className="flex gap-2 justify-center">
          <Badge className="bg-yellow-500/20 text-yellow-400">Pro Member</Badge>
          <Badge className="bg-blue-500/20 text-blue-400">Early Adopter</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 mb-8">
        <Button 
          variant="outline" 
          className="w-full justify-start h-12" 
          size="lg"
          onClick={() => alert('Feature coming soon!')}
        >
          <Camera className="mr-3" size={18} />
          Manage Photos & Memories
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start h-12" 
          size="lg"
          onClick={() => navigate('/archive')}
        >
          <Archive className="mr-3" size={18} />
          Archived Trips
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start h-12" 
          size="lg"
          onClick={() => alert('Feature coming soon!')}
        >
          <Share2 className="mr-3" size={18} />
          Shared Trip Links
        </Button>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
            <p className="text-white">Added 12 photos to Tokyo Adventure</p>
            <p className="text-xs text-gray-400">2 hours ago</p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
            <p className="text-white">Created new trip: Paris Weekend</p>
            <p className="text-xs text-gray-400">1 day ago</p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
            <p className="text-white">Joined Bali Group Trip</p>
            <p className="text-xs text-gray-400">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
