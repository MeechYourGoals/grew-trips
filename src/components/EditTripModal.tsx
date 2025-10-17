import React, { useState, useEffect } from 'react';
import { X, Loader2, MapPin, Calendar, Type } from 'lucide-react';
import { parseDateRange, formatDateRange } from '@/utils/dateFormatters';
import { tripService, Trip } from '@/services/tripService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: {
    id: number | string;
    title: string;
    location: string;
    dateRange: string;
  };
  onUpdate?: (updates: Partial<Trip>) => void;
}

export const EditTripModal = ({ isOpen, onClose, trip, onUpdate }: EditTripModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    start_date: '',
    end_date: ''
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      const dates = parseDateRange(trip.dateRange);
      setFormData({
        name: trip.title,
        destination: trip.location,
        start_date: dates.start,
        end_date: dates.end
      });
    }
  }, [isOpen, trip]);

  const handleSave = async () => {
    // Validate
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Trip name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.destination.trim()) {
      toast({
        title: "Validation Error",
        description: "Location is required",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const updates: Partial<Trip> = {
        name: formData.name,
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date
      };

      // Demo mode: store in localStorage
      if (!user) {
        localStorage.setItem(`trip_${trip.id}_updates`, JSON.stringify(updates));
        if (onUpdate) onUpdate(updates);
        toast({
          title: "Changes saved",
          description: "Trip details updated successfully (demo mode)"
        });
        onClose();
        return;
      }

      // Authenticated: save to database
      const success = await tripService.updateTrip(trip.id.toString(), updates);
      
      if (success) {
        if (onUpdate) onUpdate(updates);
        toast({
          title: "Changes saved",
          description: "Trip details updated successfully"
        });
        onClose();
      } else {
        throw new Error('Failed to update trip');
      }
    } catch (error) {
      console.error('Error updating trip:', error);
      toast({
        title: "Update failed",
        description: "Could not update trip details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 max-w-md w-full animate-scale-in relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Trip Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Trip Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Type size={16} />
              Trip Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={100}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Enter trip name"
              disabled={loading}
            />
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <MapPin size={16} />
              Location
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              maxLength={200}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Enter destination"
              disabled={loading}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Calendar size={16} />
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Calendar size={16} />
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-sm text-blue-300">
              ℹ️ All trip members can see these changes immediately
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
