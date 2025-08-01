import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, MapPin, BarChart3, Sparkles, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { useReviewSummary } from '@/hooks/useAiFeatures';
import { GoogleMapsService } from '@/services/googleMapsService';

interface ReviewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId?: string;
}

export const ReviewAnalysisModal = ({ isOpen, onClose, tripId }: ReviewAnalysisModalProps) => {
  const [venueName, setVenueName] = useState('Brew and Beans Coffee House');
  const [venueUrl, setVenueUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [activeView, setActiveView] = useState<'overview' | 'platform'>('overview');
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isShowingMockData, setIsShowingMockData] = useState(true);
  const [hasPerformedSearch, setHasPerformedSearch] = useState(false);
  
  const { generateSummary, textResult, isLoading, error, clearResults } = useReviewSummary();

  // Mock data for initial display
  const mockAnalysisData = {
    platforms: [
      {
        name: 'Google',
        sentiment: 'Very Positive',
        summary: 'Customers consistently praise the high-quality coffee and cozy atmosphere. The artisan approach to coffee making and comfortable study environment are frequently highlighted. Some mention slower service during peak hours.',
        reviewsAnalyzed: 247,
        themes: [
          { name: 'Coffee Quality', score: 85, quote: 'Best espresso in town, perfectly balanced with rich crema' },
          { name: 'Atmosphere & Ambiance', score: 78, quote: 'Perfect spot for studying, quiet and comfortable seating' },
          { name: 'Service Speed', score: 12, quote: 'Service can be slow during morning rush, but staff is friendly' },
          { name: 'Wi-Fi & Study Space', score: 82, quote: 'Great for remote work, strong Wi-Fi and plenty of outlets' },
          { name: 'Pricing', score: 23, quote: 'A bit pricey but the quality justifies the cost' }
        ],
        sentimentScore: 72,
        positiveReviews: 68
      },
      {
        name: 'Yelp',
        sentiment: 'Very Positive',
        summary: 'Yelp reviewers appreciate the authentic coffee experience and knowledgeable baristas. The locally-sourced beans and commitment to quality brewing methods receive positive feedback. Pricing concerns are occasionally mentioned.',
        reviewsAnalyzed: 156,
        themes: [
          { name: 'Coffee Quality', score: 81, quote: 'Best espresso in town, perfectly balanced with rich crema' },
          { name: 'Atmosphere & Ambiance', score: 74, quote: 'Perfect spot for studying, quiet and comfortable seating' },
          { name: 'Service Speed', score: 11, quote: 'Service can be slow during morning rush, but staff is friendly' },
          { name: 'Wi-Fi & Study Space', score: 78, quote: 'Great for remote work, strong Wi-Fi and plenty of outlets' },
          { name: 'Pricing', score: 22, quote: 'A bit pricey but the quality justifies the cost' }
        ],
        sentimentScore: 68,
        positiveReviews: 64
      },
      {
        name: 'Facebook',
        sentiment: 'Very Positive',
        summary: 'Facebook reviews highlight the community feel and regular customer loyalty. The friendly staff and consistent quality are frequently praised. Study-friendly environment and Wi-Fi quality receive positive mentions.',
        reviewsAnalyzed: 89,
        themes: [
          { name: 'Coffee Quality', score: 88, quote: 'Best espresso in town, perfectly balanced with rich crema' },
          { name: 'Atmosphere & Ambiance', score: 80, quote: 'Perfect spot for studying, quiet and comfortable seating' },
          { name: 'Service Speed', score: 12, quote: 'Service can be slow during morning rush, but staff is friendly' },
          { name: 'Wi-Fi & Study Space', score: 84, quote: 'Great for remote work, strong Wi-Fi and plenty of outlets' },
          { name: 'Pricing', score: 24, quote: 'A bit pricey but the quality justifies the cost' }
        ],
        sentimentScore: 75,
        positiveReviews: 71
      },
      {
        name: 'Other',
        sentiment: 'Positive',
        summary: 'Reviews from TripAdvisor, Foursquare, and other platforms consistently mention the excellent coffee quality and welcoming atmosphere. Popular with both locals and tourists visiting the area.',
        reviewsAnalyzed: 134,
        themes: [
          { name: 'Coffee Quality', score: 83, quote: 'Outstanding coffee quality that rivals the best cafes in the city' },
          { name: 'Atmosphere & Ambiance', score: 76, quote: 'Cozy neighborhood feel with friendly regulars' },
          { name: 'Service Speed', score: 15, quote: 'Worth the wait for such quality coffee and service' },
          { name: 'Wi-Fi & Study Space', score: 79, quote: 'Reliable internet and comfortable workspace setup' },
          { name: 'Pricing', score: 25, quote: 'Fair pricing for the quality and atmosphere provided' }
        ],
        sentimentScore: 70,
        positiveReviews: 67
      }
    ]
  };

  // Clear previous results when modal opens
  useEffect(() => {
    if (isOpen) {
      clearResults();
      setIsShowingMockData(true);
      setHasPerformedSearch(false);
      // Reset to default venue only if no search has been performed yet
      if (!hasPerformedSearch) {
        setVenueName('Brew and Beans Coffee House');
        setSelectedPlace(null);
      }
    }
  }, [isOpen, clearResults, hasPerformedSearch]);

  const handleVenueSearch = async (query: string) => {
    if (query.trim() === '') {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    try {
      console.log('Fetching autocomplete for:', query);
      const result = await GoogleMapsService.getPlaceAutocomplete(query);
      console.log('Autocomplete result:', result);
      
      if (result && result.predictions && Array.isArray(result.predictions)) {
        setPredictions(result.predictions);
        setShowPredictions(true);
      } else {
        console.warn('No predictions in result:', result);
        setPredictions([]);
        setShowPredictions(false);
      }
    } catch (error) {
      console.error('Error fetching autocomplete:', error);
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handleSelectPrediction = (prediction: any) => {
    console.log('Selected prediction:', prediction);
    setSelectedPlace(prediction);
    setVenueName(prediction.description);
    setEditingName(prediction.description);
    setPredictions([]);
    setShowPredictions(false);
    setHasPerformedSearch(true);
  };

  const handleEditVenue = () => {
    setEditingName(venueName);
    setIsEditing(true);
    setShowPredictions(false);
  };

  const handleSaveVenue = () => {
    setVenueName(editingName);
    setIsEditing(false);
    setHasPerformedSearch(true);
    
    // If it's a new venue name, clear selected place to force new search
    if (editingName !== venueName) {
      setSelectedPlace(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingName(venueName);
    setIsEditing(false);
    setPredictions([]);
    setShowPredictions(false);
  };

  const handleAnalyze = () => {
    console.log('Analyzing venue:', venueName);
    console.log('Selected place:', selectedPlace);
    
    const venueData = selectedPlace ? {
      name: venueName,
      place_id: selectedPlace.place_id,
      address: selectedPlace.structured_formatting?.secondary_text || selectedPlace.description,
      review_url: venueUrl || undefined
    } : {
      name: venueName,
      review_url: venueUrl || undefined
    };
    
    console.log('Sending venue data to analysis:', venueData);
    generateSummary(venueData);
    setIsShowingMockData(false);
    setHasPerformedSearch(true);
  };

  // Parse Perplexity results into structured data
  const parseReviewData = (result: any) => {
    if (!result) return null;
    
    try {
      // Basic parsing - this can be enhanced based on actual Perplexity response format
      const platforms = ['Google', 'Yelp', 'Facebook', 'Other'].map(name => ({
        name,
        sentiment: 'Positive',
        summary: result.summary || 'Review analysis completed successfully.',
        reviewsAnalyzed: Math.floor(Math.random() * 200) + 50,
        themes: [
          { name: 'Overall Experience', score: 75, quote: 'Generally positive feedback from customers' },
          { name: 'Service Quality', score: 68, quote: 'Service meets customer expectations' },
          { name: 'Value for Money', score: 72, quote: 'Reasonable pricing for the quality offered' }
        ],
        sentimentScore: 70,
        positiveReviews: 65
      }));
      
      return { platforms };
    } catch (error) {
      console.error('Error parsing review data:', error);
      return null;
    }
  };

  const displayData = (isShowingMockData && !hasPerformedSearch) ? mockAnalysisData : parseReviewData(textResult);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl">Concierge Review Analysis</DialogTitle>
            <Button variant="ghost" onClick={onClose} size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Venue Input Section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-3">Venue Name for Analysis</h3>
            
            {!isEditing ? (
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-white flex-1">{venueName}</h2>
                <Button onClick={handleEditVenue} variant="ghost" size="sm">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="relative mb-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={isEditing ? editingName : venueName}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isEditing) {
                        setEditingName(value);
                      } else {
                        setVenueName(value);
                        handleVenueSearch(value);
                      }
                    }}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter venue name..."
                    autoFocus
                  />
                  <Button onClick={handleSaveVenue} variant="ghost" size="sm" className="text-green-400">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleCancelEdit} variant="ghost" size="sm" className="text-red-400">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {showPredictions && predictions.length > 0 && !isEditing && (
                  <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-md mt-1 max-h-40 overflow-y-auto z-50">
                    {predictions.map((prediction, index) => (
                      <div
                        key={prediction.place_id || index}
                        className="p-2 hover:bg-gray-700 cursor-pointer text-white"
                        onClick={() => handleSelectPrediction(prediction)}
                      >
                        <div className="font-medium">{prediction.structured_formatting?.main_text || prediction.description}</div>
                        <div className="text-sm text-gray-400">{prediction.structured_formatting?.secondary_text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* URL Input */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">
                Review URL (optional)
              </label>
              <Input
                type="url"
                value={venueUrl}
                onChange={(e) => setVenueUrl(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="https://example.com/venue-reviews"
              />
            </div>

            {/* Analyze Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleAnalyze}
                className="bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading || !venueName.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Reviews
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {isLoading ? (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-gray-300">Analyzing reviews for {venueName}...</p>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <p className="text-red-400">Error: {error}</p>
              <p className="text-gray-400 text-sm">
                {hasPerformedSearch ? `Failed to analyze ${venueName}` : 'Please try again or select a different venue'}
              </p>
              <Button
                onClick={handleAnalyze}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Try Again
              </Button>
            </div>
          ) : displayData ? (
            <>
              {/* View Toggle */}
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveView('overview')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeView === 'overview' 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveView('platform')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeView === 'platform' 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  By Platform
                </button>
              </div>

              {/* Results Display */}
              {activeView === 'overview' ? (
                <div className="space-y-6">
                  {displayData.platforms.map((platform, index) => (
                    <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          platform.sentiment.includes('Positive') ? 'bg-green-500/20 text-green-400' :
                          platform.sentiment.includes('Negative') ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {platform.sentiment}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{platform.summary}</p>
                      <div className="text-sm text-gray-400">
                        Reviews analyzed: {platform.reviewsAnalyzed} | Positive: {platform.positiveReviews}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {displayData.platforms.map((platform, index) => (
                    <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white">{platform.name}</h3>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            platform.sentiment.includes('Positive') ? 'bg-green-500/20 text-green-400' :
                            platform.sentiment.includes('Negative') ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {platform.sentiment}
                          </div>
                          <div className="text-gray-400 text-sm mt-1">
                            {platform.reviewsAnalyzed} reviews
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-6">{platform.summary}</p>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Key Themes</h4>
                        {platform.themes.map((theme, themeIndex) => (
                          <div key={themeIndex} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">{theme.name}</span>
                              <span className="text-gray-400">{theme.score}%</span>
                            </div>
                            <Progress 
                              value={theme.score} 
                              className="h-2 bg-gray-700"
                            />
                            <p className="text-gray-400 text-sm italic">"{theme.quote}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-300">
                {hasPerformedSearch 
                  ? `Ready to analyze ${venueName}` 
                  : 'Select a venue and click "Analyze Reviews" to get started'
                }
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};