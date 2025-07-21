
import React, { useState, useCallback } from 'react';
import { Search, Filter, Archive, Calendar, MapPin, Users } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import { tripsData } from '../data/tripsData';
import { proTripMockData } from '../data/proTripMockData';
import { eventsMockData } from '../data/eventsMockData';
import { MobileModal } from '../components/mobile/MobileModal';

interface SearchResult {
  id: string;
  type: 'regular' | 'pro' | 'event';
  title: string;
  location: string;
  dateRange: string;
  status: 'active' | 'archived' | 'upcoming';
  participants: number;
  matchScore: number;
  deepLink: string;
}

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all'
  });
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search regular trips
    tripsData.forEach(trip => {
      let score = 0;
      if (trip.title.toLowerCase().includes(query)) score += 3;
      if (trip.location.toLowerCase().includes(query)) score += 2;
      if (trip.dateRange.toLowerCase().includes(query)) score += 1;
      
      if (score > 0) {
        searchResults.push({
          id: trip.id.toString(),
          type: 'regular',
          title: trip.title,
          location: trip.location,
          dateRange: trip.dateRange,
          status: new Date(trip.dateRange.split(' - ')[1]) < new Date() ? 'archived' : 'upcoming',
          participants: trip.participants.length,
          matchScore: score,
          deepLink: `/trip/${trip.id}`
        });
      }
    });

    // Search pro trips - Fixed: use participants instead of teamMembers
    Object.values(proTripMockData).forEach(trip => {
      let score = 0;
      if (trip.title.toLowerCase().includes(query)) score += 3;
      if (trip.location.toLowerCase().includes(query)) score += 2;
      if (trip.dateRange.toLowerCase().includes(query)) score += 1;
      
      if (score > 0) {
        searchResults.push({
          id: trip.id,
          type: 'pro',
          title: trip.title,
          location: trip.location,
          dateRange: trip.dateRange,
          status: new Date(trip.dateRange.split(' - ')[1]) < new Date() ? 'archived' : 'upcoming',
          participants: trip.participants?.length || 0,
          matchScore: score,
          deepLink: `/tour/pro/${trip.id}`
        });
      }
    });

    // Search events - Fixed: use participants instead of attendees
    Object.values(eventsMockData).forEach(event => {
      let score = 0;
      if (event.title.toLowerCase().includes(query)) score += 3;
      if (event.location.toLowerCase().includes(query)) score += 2;
      if (event.dateRange.toLowerCase().includes(query)) score += 1;
      
      if (score > 0) {
        searchResults.push({
          id: event.id,
          type: 'event',
          title: event.title,
          location: event.location,
          dateRange: event.dateRange,
          status: new Date(event.dateRange.split(' - ')[1]) < new Date() ? 'archived' : 'upcoming',
          participants: event.participants?.length || 0,
          matchScore: score,
          deepLink: `/event/${event.id}`
        });
      }
    });

    // Sort by match score and apply filters
    const filtered = searchResults
      .filter(result => {
        if (selectedFilters.status !== 'all' && result.status !== selectedFilters.status) return false;
        if (selectedFilters.type !== 'all' && result.type !== selectedFilters.type) return false;
        return true;
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    setResults(filtered);
  }, [selectedFilters]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.deepLink);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
      case 'archived':
        return <Badge className="bg-gray-500/20 text-gray-400"><Archive size={12} className="mr-1" />Archived</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500/20 text-blue-400">Upcoming</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'pro':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pro</Badge>;
      case 'event':
        return <Badge className="bg-purple-500/20 text-purple-400">Event</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-400">Trip</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Search Trips</h1>
        <p className="text-gray-400">Find any trip, active or archived</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search by name, location, date..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            performSearch(e.target.value);
          }}
          className="pl-10 pr-12 bg-gray-900/80 border-gray-700 text-white placeholder-gray-400 h-12"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(true)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Filter size={18} />
        </Button>
      </div>

      {/* Active Filters */}
      {(selectedFilters.status !== 'all' || selectedFilters.type !== 'all') && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {selectedFilters.status !== 'all' && (
            <Badge variant="secondary" className="bg-gray-800">
              Status: {selectedFilters.status}
            </Badge>
          )}
          {selectedFilters.type !== 'all' && (
            <Badge variant="secondary" className="bg-gray-800">
              Type: {selectedFilters.type}
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {query && results.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No trips found for "{query}"
          </div>
        )}
        
        {!query && (
          <div className="text-center py-8 text-gray-400">
            Start typing to search your trips...
          </div>
        )}

        {results.map((result) => (
          <div
            key={`${result.type}-${result.id}`}
            onClick={() => handleResultClick(result)}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{result.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {result.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {result.dateRange}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    {result.participants}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {getTypeBadge(result.type)}
              {getStatusBadge(result.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Filters Modal */}
      <MobileModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Results"
      >
        <div className="space-y-6 p-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['all', 'active', 'upcoming', 'archived'].map((status) => (
                <Button
                  key={status}
                  variant={selectedFilters.status === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilters(prev => ({ ...prev, status }))}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">Trip Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['all', 'regular', 'pro', 'event'].map((type) => (
                <Button
                  key={type}
                  variant={selectedFilters.type === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilters(prev => ({ ...prev, type }))}
                  className="capitalize"
                >
                  {type === 'regular' ? 'Trip' : type}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => {
              setSelectedFilters({ status: 'all', type: 'all', dateRange: 'all' });
              setShowFilters(false);
            }}
            variant="outline"
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </MobileModal>
    </div>
  );
};

export default SearchPage;
