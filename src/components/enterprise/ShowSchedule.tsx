
import React from 'react';
import { Music, MapPin, Clock, Plus, Mic, Calendar } from 'lucide-react';
import { SmartImport } from '../SmartImport';
import { useShowSchedule } from '../../hooks/useShowSchedule';

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

export const ShowSchedule = ({ organizationId }: { organizationId?: string }) => {
  const { shows, isLoading, bulkCreateShows, updateShow } = useShowSchedule(organizationId);

  const parseConfig = {
    targetType: 'schedule' as const,
    expectedFields: ['title', 'date', 'time', 'venue', 'soundcheck_time', 'load_in_time'],
    description: 'Import show schedule from tour calendars, PDF schedules, or CSV files. AI will automatically extract show details, venues, and timing.'
  };

  const handleSmartImport = (importedData: any[]) => {
    const newShows = importedData.map((item) => ({
      title: item.title || item.show_name || item.event || 'TBD',
      venue: item.venue || item.location || item.stadium || 'TBD',
      venue_address: item.venue_address || item.address || '',
      show_date: item.date || item.show_date || new Date().toISOString().split('T')[0],
      show_time: item.time || item.start_time || '20:00',
      soundcheck_time: item.soundcheck_time || item.rehearsal_time || '17:00',
      load_in_time: item.load_in_time || item.arrival_time || '08:00',
      status: 'scheduled' as const
    }));

    bulkCreateShows(newShows);
  };

  const handleCancelShow = (showId: string) => {
    updateShow({ id: showId, updates: { status: 'cancelled' } });
  };

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

      {/* Smart Import Component */}
      <SmartImport
        targetCollection="shows"
        parseConfig={parseConfig}
        onDataImported={handleSmartImport}
        className="mb-6"
      />

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        {isLoading ? (
          <div className="text-center text-gray-400 py-8">Loading shows...</div>
        ) : shows.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No shows scheduled yet. Add a show or use Smart Import.</div>
        ) : (
          <div className="space-y-4">
            {shows.map((show: any) => (
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
                  <button 
                    onClick={() => handleCancelShow(show.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={14} />
                  {show.show_date}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={14} />
                  Show: {show.show_time}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={14} />
                  Soundcheck: {show.soundcheck_time}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={14} />
                  Load-in: {show.load_in_time}
                </div>
              </div>
              
              <div className="mt-3 flex items-center gap-2 text-gray-400">
                <MapPin size={14} />
                <span>{show.venue} - {show.venue_address}</span>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
