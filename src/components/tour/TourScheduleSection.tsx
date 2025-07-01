import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Plus, Edit2 } from 'lucide-react';
import { useTripVariant } from '../../contexts/TripVariantContext';
import { Tour, TourTrip } from '../../types/tour';

interface TourScheduleSectionProps {
  tour: Tour;
  onTripAdded: (trip: TourTrip) => void;
}

export const TourScheduleSection = ({ tour, onTripAdded }: TourScheduleSectionProps) => {
  const { accentColors } = useTripVariant();
  const [newTrip, setNewTrip] = useState<Omit<TourTrip, 'id' | 'tourId'>>({
    city: '',
    venue: '',
    venueAddress: '',
    date: '',
    category: 'headline',
    status: 'planned',
    participants: [],
    accommodation: {
      type: 'hotel',
      name: '',
      address: '',
      confirmationNumber: '',
      checkIn: '',
      checkOut: '',
    },
    transportation: {
      type: 'flight',
      details: '',
      confirmationNumber: '',
      dateTime: '',
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section?: string) => {
    const { name, value } = e.target;
    if (section === 'accommodation' || section === 'transportation') {
      setNewTrip(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof TourTrip],
          [name]: value,
        } as any,
      }));
    } else {
      setNewTrip(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTrip = () => {
    const newTripWithId = { ...newTrip, id: Math.random().toString(36).substring(2, 15), tourId: tour.id };
    onTripAdded(newTripWithId);
    setNewTrip({
      city: '',
      venue: '',
      venueAddress: '',
      date: '',
      category: 'headline',
      status: 'planned',
      participants: [],
      accommodation: {
        type: 'hotel',
        name: '',
        address: '',
        confirmationNumber: '',
        checkIn: '',
        checkOut: '',
      },
      transportation: {
        type: 'flight',
        details: '',
        confirmationNumber: '',
        dateTime: '',
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Tour Schedule</h3>
        <button
          onClick={handleAddTrip}
          className={`bg-gradient-to-r ${accentColors.gradient} hover:bg-gradient-to-l text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2`}
        >
          <Plus size={16} />
          Add Trip
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="space-y-4">
          {tour.trips.map((trip) => (
            <div key={trip.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{trip.city}</h4>
                <div className="flex gap-2">
                  <button className="text-glass-orange hover:text-glass-orange/80 text-sm">Edit</button>
                  {/* <button className="text-red-400 hover:text-red-300 text-sm">Delete</button> */}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={14} />
                  {trip.date}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={14} />
                  {trip.venue}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={14} />
                  {trip.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
