
import React from 'react';
import { SearchBar } from './SearchBar';
import { SearchResults, SearchResult } from './SearchResults';
import { useTripSearch } from '../hooks/useTripSearch';

interface TripSearchTabProps {
  tripId: string;
}

export const TripSearchTab = ({ tripId }: TripSearchTabProps) => {
  const { search, results, isLoading, clearResults } = useTripSearch(tripId);

  const handleResultClick = (result: SearchResult) => {
    // Navigate within the current trip to the specific section
    const element = document.getElementById(result.objectType);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    // For now, just show an alert with the result
    alert(`Clicked on ${result.objectType}: ${result.snippet}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Search This Trip</h3>
        <SearchBar
          placeholder="Search messages, events, files, receipts..."
          onSearch={search}
          isLoading={isLoading}
          className="w-full"
        />
      </div>

      {(results.length > 0 || isLoading) && (
        <SearchResults
          results={results}
          onResultClick={handleResultClick}
          isLoading={isLoading}
        />
      )}

      {!isLoading && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">Start typing to search within this trip</p>
          <p className="text-gray-500 text-sm">
            Search through messages, calendar events, files, receipts, and more
          </p>
        </div>
      )}
    </div>
  );
};
