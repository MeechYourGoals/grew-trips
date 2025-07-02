
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Plus, Settings } from 'lucide-react';
import { InviteModal } from './InviteModal';
import { useAuth } from '../hooks/useAuth';
import { useTripVariant } from '../contexts/TripVariantContext';
import { CategorySelector } from './pro/CategorySelector';
import { CategoryTags } from './pro/CategoryTags';
import { ProTripCategory } from '../types/proCategories';

interface TripHeaderProps {
  trip: {
    id: number;
    title: string;
    location: string;
    dateRange: string;
    description: string;
    participants: Array<{
      id: number;
      name: string;
      avatar: string;
    }>;
  };
  onManageUsers?: () => void;
  // Pro-specific props
  category?: ProTripCategory;
  tags?: string[];
  onCategoryChange?: (category: ProTripCategory) => void;
}

export const TripHeader = ({ trip, onManageUsers, category, tags = [], onCategoryChange }: TripHeaderProps) => {
  const { user } = useAuth();
  const [showInvite, setShowInvite] = useState(false);
  const { variant, accentColors } = useTripVariant();
  const isPro = variant === 'pro';

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Trip Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-4">{trip.title}</h1>
            
            {/* Category Tags for Pro trips */}
            {isPro && category && (
              <div className="mb-4">
                <CategoryTags category={category} tags={tags} />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={18} className={`text-${accentColors.primary}`} />
                <span>{trip.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={18} className={`text-${accentColors.primary}`} />
                <span>{trip.dateRange}</span>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {trip.description}
            </p>
          </div>

          {/* Collaborators */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={20} className={`text-${accentColors.primary}`} />
                <h3 className="text-white font-semibold">Trip Collaborators</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{trip.participants.length}</span>
                {onManageUsers && (
                  <button
                    onClick={onManageUsers}
                    className={`text-gray-400 hover:text-${accentColors.primary} transition-colors p-1 rounded-lg hover:bg-white/10`}
                    title="Manage users"
                  >
                    <Settings size={16} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Category Selector for Pro trips */}
            {isPro && category && onCategoryChange && (
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Trip Category</label>
                <CategorySelector
                  selectedCategory={category}
                  onCategoryChange={onCategoryChange}
                />
              </div>
            )}
            
            <div className="space-y-3 mb-4">
              {trip.participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full border-2 border-white/20"
                  />
                  <span className="text-white font-medium">{participant.name}</span>
                </div>
              ))}
            </div>

            {user && (
              <button
                onClick={() => setShowInvite(true)}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${accentColors.gradient} hover:from-${accentColors.primary}/80 hover:to-${accentColors.secondary}/80 text-white font-medium py-3 rounded-xl transition-all duration-200 hover:scale-105`}
              >
                <Plus size={16} />
                Invite to Trip
              </button>
            )}
          </div>
        </div>
      </div>

      <InviteModal 
        isOpen={showInvite} 
        onClose={() => setShowInvite(false)}
        tripName={trip.title}
        tripId={trip.id.toString()}
      />
    </>
  );
};
