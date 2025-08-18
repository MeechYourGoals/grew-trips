import React, { useState } from 'react';
import { Users, Plus, Mail, User, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Attendee {
  id: string;
  name: string;
  email: string;
  status: 'confirmed' | 'pending';
}

export const SimpleAttendeeSection = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: '1', name: 'John Smith', email: 'john@example.com', status: 'confirmed' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', status: 'pending' },
    { id: '3', name: 'Mike Davis', email: 'mike@example.com', status: 'confirmed' }
  ]);
  
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const addAttendee = () => {
    if (newAttendee.name && newAttendee.email) {
      const attendee: Attendee = {
        id: Date.now().toString(),
        name: newAttendee.name,
        email: newAttendee.email,
        status: 'pending'
      };
      setAttendees([...attendees, attendee]);
      setNewAttendee({ name: '', email: '' });
      setShowAddForm(false);
    }
  };

  const removeAttendee = (id: string) => {
    setAttendees(attendees.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users size={24} className="text-glass-orange" />
          Attendee Management
        </h3>
        <p className="text-gray-300 mt-2">Manage your event attendees with simple RSVP tracking</p>
      </div>

      {/* Add Attendee Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Add Attendees</h4>
          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-glass-orange hover:bg-glass-orange/80 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Attendee
            </Button>
          )}
        </div>

        {showAddForm && (
          <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="attendeeName" className="text-white">Name</Label>
                <Input
                  id="attendeeName"
                  value={newAttendee.name}
                  onChange={(e) => setNewAttendee({...newAttendee, name: e.target.value})}
                  className="bg-gray-800/50 border-gray-600 text-white mt-2"
                  placeholder="Attendee name"
                />
              </div>
              <div>
                <Label htmlFor="attendeeEmail" className="text-white">Email</Label>
                <Input
                  id="attendeeEmail"
                  type="email"
                  value={newAttendee.email}
                  onChange={(e) => setNewAttendee({...newAttendee, email: e.target.value})}
                  className="bg-gray-800/50 border-gray-600 text-white mt-2"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  setNewAttendee({ name: '', email: '' });
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={addAttendee}
                className="bg-glass-orange hover:bg-glass-orange/80"
                disabled={!newAttendee.name || !newAttendee.email}
              >
                Add Attendee
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Attendee List */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">
            Attendee List ({attendees.length} total)
          </h4>
        </div>

        <div className="space-y-3">
          {attendees.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No attendees yet. Add some people to get started!</p>
            </div>
          ) : (
            attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <User size={20} className="text-glass-orange" />
                  <div>
                    <p className="text-white font-medium">{attendee.name}</p>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Mail size={14} />
                      {attendee.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    attendee.status === 'confirmed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {attendee.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttendee(attendee.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-green-500/20 rounded-lg p-4">
            <p className="text-2xl font-bold text-green-400">
              {attendees.filter(a => a.status === 'confirmed').length}
            </p>
            <p className="text-gray-300 text-sm">Confirmed</p>
          </div>
          <div className="bg-yellow-500/20 rounded-lg p-4">
            <p className="text-2xl font-bold text-yellow-400">
              {attendees.filter(a => a.status === 'pending').length}
            </p>
            <p className="text-gray-300 text-sm">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};