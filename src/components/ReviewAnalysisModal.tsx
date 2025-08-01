import React, { useState, useRef, useEffect } from 'react';
import { X, Volume2, Play, Pause, Edit2, Check, BarChart3, Sparkles, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { PremiumBadge } from './PremiumBadge';
import { useReviewSummary } from '@/hooks/useAiFeatures';
import { validateUrl } from '@/services/aiFeatures';
import { GoogleMapsService } from '@/services/googleMapsService';

interface ReviewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId?: string;
}

export const ReviewAnalysisModal = ({ isOpen, onClose, tripId }: ReviewAnalysisModalProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [venueName, setVenueName] = useState('Brew & Beans Coffee House');
  const [venueUrl, setVenueUrl] = useState('');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeView, setActiveView] = useState<'overview' | 'platform'>('overview');
  const [isEditingVenue, setIsEditingVenue] = useState(false);
  const [tempVenueName, setTempVenueName] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isShowingMockData, setIsShowingMockData] = useState(true);

  // Use the real AI features hooks
  const { 
    generateSummary, 
    isLoading, 
    error, 
    textResult, 
     
    clearResults 
  } = useReviewSummary();

  // Mock data for default display
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

  // Clear results when modal opens but keep mock data
  useEffect(() => {
    if (isOpen) {
      clearResults();
      setVenueName('Brew & Beans Coffee House');
      setVenueUrl('');
      setIsShowingMockData(true);
    }
  }, [isOpen, clearResults]);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPlace(null);
      setPredictions([]);
      setShowPredictions(false);
    }
  }, [isOpen]);

  const handleVenueSearch = async (query: string) => {
    setTempVenueName(query);
    
    if (query.length > 2) {
      try {
        const result = await GoogleMapsService.getPlaceAutocomplete(query);
        if (result.predictions && result.predictions.length > 0) {
          setPredictions(result.predictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      } catch (error) {
        console.error('Error fetching place predictions:', error);
        setPredictions([]);
        setShowPredictions(false);
      }
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handleSelectPrediction = async (prediction: any) => {
    setTempVenueName(prediction.description);
    setSelectedPlace(prediction);
    setPredictions([]);
    setShowPredictions(false);
  };

  const handleEditVenue = () => {
    setTempVenueName(venueName);
    setIsEditingVenue(true);
  };

  const handleSaveVenue = () => {
    if (tempVenueName.trim()) {
      setVenueName(tempVenueName.trim());
      // Clear mock data flag when a real venue is selected
      setIsShowingMockData(false);
    }
    setIsEditingVenue(false);
    setShowPredictions(false);
  };

  const handleCancelEdit = () => {
    setTempVenueName('');
    setIsEditingVenue(false);
  };

  const handleAnalyze = async () => {
    if (!venueName.trim()) {
      return;
    }

    setIsShowingMockData(false);
    
    // Create venue object for analysis
    const venueData = {
      name: venueName,
      url: venueUrl || '',
      place_id: selectedPlace?.place_id || '',
      address: selectedPlace?.description || venueName
    };
    
    await generateSummary(venueData);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Parse Perplexity results into platform structure
  const parseReviewData = (result: any) => {
    if (!result) return null;
    
    try {
      // Expect structured response with platform sections
      const platforms = [];
      
      // Extract platform data from Perplexity response
      const sections = result.text?.split('Platform:') || [];
      
      for (const section of sections.slice(1)) {
        const lines = section.trim().split('\n').filter(Boolean);
        if (lines.length === 0) continue;
        
        const platformName = lines[0].trim();
        let summary = '', reviewCount = 0, sentiment = 'neutral';
        const themes = [];
        
        for (const line of lines.slice(1)) {
          if (line.includes('Summary:')) {
            summary = line.replace('Summary:', '').trim();
          } else if (line.includes('Reviews:')) {
            reviewCount = parseInt(line.match(/\d+/)?.[0] || '0');
          } else if (line.includes('Sentiment:')) {
            sentiment = line.replace('Sentiment:', '').trim().toLowerCase();
          } else if (line.includes('Theme:')) {
            const themeMatch = line.match(/Theme: (.+?) - (.+?) \((.+?)\)/);
            if (themeMatch) {
              themes.push({
                name: themeMatch[1],
                quote: themeMatch[2],
                score: Math.random() * 100 // Placeholder score
              });
            }
          }
        }
        
        platforms.push({
          name: platformName,
          sentiment: sentiment.includes('positive') ? 'Positive' : 
                   sentiment.includes('negative') ? 'Negative' : 'Neutral',
          summary: summary || 'Analysis summary not available',
          reviewsAnalyzed: reviewCount || 0,
          themes: themes.length > 0 ? themes : [
            { name: 'Overall Experience', score: 75, quote: 'General positive feedback' }
          ],
          sentimentScore: sentiment.includes('positive') ? 70 : 
                         sentiment.includes('negative') ? 30 : 50,
          positiveReviews: Math.round(reviewCount * 0.7)
        });
      }
      
      // If parsing fails, create default structure
      if (platforms.length === 0) {
        ['Google', 'Yelp', 'Facebook', 'Other'].forEach(name => {
          platforms.push({
            name,
            sentiment: 'Positive',
            summary: result.summary || 'Review analysis completed',
            reviewsAnalyzed: 0,
            themes: [{ name: 'Overall Experience', score: 75, quote: 'Analysis in progress' }],
            sentimentScore: 70,
            positiveReviews: 0
          });
        });
      }
      
      return { platforms };
    } catch (error) {
      console.error('Error parsing review data:', error);
      return null;
    }
  };

  const reviewData = parseReviewData(textResult);
  
  // Use mock data by default, real data after analysis
  const displayData = isShowingMockData ? mockAnalysisData : reviewData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="relative border-b border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Review Summaries</h2>
                <p className="text-gray-400 text-sm">Analyze reviews from multiple platforms with AI-powered insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PremiumBadge />
              <Button variant="ghost" onClick={onClose} size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Venue Name Section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-3">Venue Name for Analysis</h3>
            
            {!isEditingVenue ? (
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-white">{venueName}</h2>
                <button 
                  onClick={handleEditVenue}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-4 mb-4 relative">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={tempVenueName}
                      onChange={(e) => handleVenueSearch(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white focus:border-primary"
                      placeholder="Search for venue..."
                      autoFocus
                    />
                    {showPredictions && predictions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {predictions.map((prediction) => (
                          <button
                            key={prediction.place_id}
                            onClick={() => handleSelectPrediction(prediction)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white border-b border-gray-700 last:border-b-0"
                          >
                            <div className="font-medium">{prediction.structured_formatting.main_text}</div>
                            <div className="text-sm text-gray-400">{prediction.structured_formatting.secondary_text}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button onClick={handleSaveVenue} size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
                    <Check size={16} />
                  </Button>
                  <Button onClick={handleCancelEdit} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                    <X size={16} />
                  </Button>
                </div>
              </div>
            )}

            {/* URL Input Field */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">
                Review URL (optional)
              </label>
              <Input
                type="url"
                value={venueUrl}
                onChange={(e) => setVenueUrl(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-primary"
                placeholder="https://example.com/venue-reviews"
              />
            </div>

            {/* Analyze Button */}
            <div className="flex items-center justify-end">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={handleAnalyze}
                disabled={isLoading || !venueName.trim()}
              >
                {isLoading ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Sparkles size={16} className="mr-2" />
                )}
                {isLoading ? 'Analyzing...' : 'Analyze Reviews'}
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="text-gray-300">Analyzing reviews with AI...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
              <p className="text-red-300">Failed to analyze reviews: {error}</p>
            </div>
          )}

          {/* Results Section - Show by default with mock data */}
          {(isShowingMockData || textResult) && displayData && (
            <>
              {/* Platform Toggle */}
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

              {/* Content */}
              {activeView === 'overview' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayData?.platforms.slice(0, 4).map((platform) => (
                    <div key={platform.name} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">{platform.name}</h3>
                        <span className={`text-white text-xs px-2 py-1 rounded-full ${
                          platform.sentiment.includes('Positive') ? 'bg-green-600' :
                          platform.sentiment.includes('Negative') ? 'bg-red-600' :
                          'bg-gray-600'
                        }`}>
                          {platform.sentiment}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{platform.summary}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        💬 {platform.reviewsAnalyzed} reviews analyzed
                      </div>
                      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
                        <p className="text-primary text-sm italic">"{platform.themes[0]?.quote || 'Analysis completed'}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {displayData?.platforms.map((platform) => (
                    <div key={platform.name} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                          <span className={`text-white text-xs px-2 py-1 rounded-full ${
                            platform.sentiment.includes('Positive') ? 'bg-green-600' :
                            platform.sentiment.includes('Negative') ? 'bg-red-600' :
                            'bg-gray-600'
                          }`}>
                            {platform.sentiment}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6 leading-relaxed">{platform.summary}</p>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-medium">Key Themes</h4>
                            <span className="text-xs text-gray-400">{platform.reviewsAnalyzed} reviews</span>
                          </div>
                          <div className="space-y-3">
                            {platform.themes.map((theme, index) => (
                              <div key={`${theme.name}-${index}`} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-300 text-sm">{theme.name}</span>
                                  <span className="text-gray-400 text-xs">{Math.round(theme.score)}%</span>
                                </div>
                                <Progress value={theme.score} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-medium mb-4">Sample Reviews</h4>
                          <div className="space-y-3">
                            {platform.themes.slice(0, 3).map((theme, index) => (
                              <div key={`${theme.name}-quote-${index}`} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                <div className="text-xs text-gray-400 mb-1">{theme.name}</div>
                                <p className="text-gray-300 text-sm italic">"{theme.quote}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};