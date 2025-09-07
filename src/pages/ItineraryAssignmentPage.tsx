
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar } from 'lucide-react';
import { CategoryAssignments } from '../components/CategoryAssignments';
import { CollaborativeItineraryCalendar } from '../components/CollaborativeItineraryCalendar';

export interface TripMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface CategoryAssignment {
  categoryId: string;
  assignedUsers: TripMember[];
  leadUserId?: string;
}

const ItineraryAssignmentPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<CategoryAssignment[]>([]);
  const [activeView, setActiveView] = useState<'assignments' | 'calendar'>('assignments');

  // Mock trip members
  const tripMembers: TripMember[] = [
    { id: '1', name: 'Joe', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', email: 'joe@example.com' },
    { id: '2', name: 'Phil', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', email: 'phil@example.com' },
    { id: '3', name: 'Stephanie', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', email: 'stephanie@example.com' },
    { id: '4', name: 'Elissa', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', email: 'elissa@example.com' },
    { id: '5', name: 'Tara', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face', email: 'tara@example.com' }
  ];

  const handleAssignmentChange = (newAssignments: CategoryAssignment[]) => {
    setAssignments(newAssignments);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(`/trip/${tripId}`)}
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group"
          >
            <div className="bg-gray-800 p-2 rounded-lg shadow-lg group-hover:shadow-yellow-500/20 transition-all border border-gray-700 hover:border-yellow-500/50">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium">Back to Trip</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('assignments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                activeView === 'assignments'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              <Users size={16} />
              Assignments
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                activeView === 'calendar'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              <Calendar size={16} />
              Calendar
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Itinerary Management</h1>
          <p className="text-gray-400">Assign responsibilities and collaborate on your trip planning</p>
        </div>

        {/* Content */}
        {activeView === 'assignments' ? (
          <CategoryAssignments 
            tripMembers={tripMembers}
            assignments={assignments}
            onAssignmentChange={handleAssignmentChange}
          />
        ) : (
          <CollaborativeItineraryCalendar 
            tripMembers={tripMembers}
            assignments={assignments}
            tripId={tripId || ''}
          />
        )}
      </div>
    </div>
  );
};

export default ItineraryAssignmentPage;
