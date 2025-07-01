
import React, { useState } from 'react';
import { Music, MapPin, Clock, Plus, Mic, Calendar } from 'lucide-react';

interface Show {
  id: string;
  title: string;
  venue: string;
  venueAddress: string;
  showDate: string;
  showTime: string;
  soundCheckTime: string;
  loadInTime: string;
  status: 'confirmed' | 'scheduled' | 'completed' | 'cancelled';
}

export const ShowSchedule = () => {
  const [shows] = useState<Show[]>([
    {
      id: '1',
      title: 'The Eras Tour - Night 1',
      venue: 'SoFi Stadium',
      venueAddress: '1001 Stadium Dr, Inglewood, CA',
      showDate: '2025-02-15',
      showTime: '20:00',
      soundCheckTime: '17:00',
      loadInTime: '08:00',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'The Eras Tour - Night 2',
      venue: 'SoFi Stadium',
      venueAddress: '1001 Stadium Dr, Inglewood, CA',
      showDate: '2025-02-16',
      showTime: '20:00',
      soundCheckTime: '17:00',
      loadInTime: '08:00',
      status: 'scheduled'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Music size={24} className="text-glass-orange" />
          Show Schedule
        </h3>
        <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={16} />
          Add Show
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="space-y-4">
          {shows.map((show) => (
            <div key={show.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Mic size={16} className="text-glass-orange" />
                  <h4 className="text-white font-medium">{show.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    show.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {show.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="text-glass-orange hover:text-glass-orange/80 text-sm">Edit</button>
                  <button className="text-red-400 hover:text-red-300 text-sm">Cancel</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={14} />
                  {show.showDate}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={14} />
                  Show: {show.showTime}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={14} />
                  Soundcheck: {show.soundCheckTime}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={14} />
                  Load-in: {show.loadInTime}
                </div>
              </div>
              
              <div className="mt-3 flex items-center gap-2 text-gray-400">
                <MapPin size={14} />
                <span>{show.venue} - {show.venueAddress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
