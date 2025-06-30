
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { SearchResults, SearchResult } from './SearchResults';
import { useGlobalSearch } from '../hooks/useGlobalSearch';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal = ({ isOpen, onClose }: GlobalSearchModalProps) => {
  const navigate = useNavigate();
  const { search, results, isLoading, clearResults } = useGlobalSearch();

  useEffect(() => {
    if (!isOpen) {
      clearResults();
    }
  }, [isOpen, clearResults]);

  const handleResultClick = (result: SearchResult) => {
    // Navigate to the appropriate trip with deep-link
    let path = `/trip/${result.tripId}`;
    
    // Add hash for specific sections
    if (result.objectType === 'calendar_event') {
      path += '#calendar';
    } else if (result.objectType === 'receipt') {
      path += '#receipts';
    } else if (result.objectType === 'file') {
      path += '#files';
    } else if (result.objectType === 'message') {
      path += '#chat';
    }

    // Check if it's a Pro trip
    if (result.tripId.startsWith('pro-')) {
      path = `/tour/pro/${result.tripId}`;
    }

    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Search Everything</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <SearchBar
              placeholder="Search trips, people, files, messages..."
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
        </div>
      </div>
    </div>
  );
};
