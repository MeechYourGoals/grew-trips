import React, { useState, useRef, useEffect } from 'react';
import { X, Volume2, Play, Pause, Edit2, Check, BarChart3, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { PremiumBadge } from './PremiumBadge';

interface ReviewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId?: string;
}

export const ReviewAnalysisModal = ({ isOpen, onClose, tripId }: ReviewAnalysisModalProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [venueName, setVenueName] = useState('Artisan Coffee House');
  const [venueUrl, setVenueUrl] = useState('');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeView, setActiveView] = useState<'overview' | 'platform'>('overview');
  const [isEditingVenue, setIsEditingVenue] = useState(false);
  const [tempVenueName, setTempVenueName] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [placesService, setPlacesService] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  // Auto-show results when modal opens for demo purposes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowResults(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowResults(false);
    }
  }, [isOpen]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const initializePlaces = async () => {
      if ((window as any).google?.maps?.places) {
        const service = new (window as any).google.maps.places.AutocompleteService();
        setPlacesService(service);
      }
    };
    
    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.onload = initializePlaces;
      document.head.appendChild(script);
    } else {
      initializePlaces();
    }
  }, []);

  const handleVenueSearch = (query: string) => {
    setTempVenueName(query);
    
    if (placesService && query.length > 2) {
      placesService.getPlacePredictions(
        {
          input: query,
          types: ['establishment'],
        },
        (predictions: any, status: any) => {
          if (status === 'OK' && predictions) {
            setPredictions(predictions);
            setShowPredictions(true);
          } else {
            setPredictions([]);
            setShowPredictions(false);
          }
        }
      );
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  const handleSelectPrediction = (prediction: any) => {
    setTempVenueName(prediction.description);
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
    }
    setIsEditingVenue(false);
  };

  const handleCancelEdit = () => {
    setTempVenueName('');
    setIsEditingVenue(false);
  };

  const handleAnalyze = () => {
    // Show results immediately with mock data for demo
    setShowResults(true);
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

  // Rich mock data from the original ReviewAnalysis page
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
      }
    ]
  };

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
                <h2 className="text-2xl font-bold text-white">AI Review & Audio Summaries</h2>
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

            {/* Audio Toggle and Analyze Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch 
                  id="include-audio" 
                  checked={includeAudio} 
                  onCheckedChange={setIncludeAudio}
                />
                <label htmlFor="include-audio" className="text-gray-300 text-sm">
                  <Volume2 size={16} className="inline mr-2" />
                  Generate AI Audio Overview
                </label>
              </div>
              
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={handleAnalyze}
              >
                <Sparkles size={16} className="mr-2" />
                Analyze Reviews
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {showResults && (
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
                <div className="grid md:grid-cols-3 gap-6">
                  {mockAnalysisData.platforms.map((platform) => (
                    <div key={platform.name} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">{platform.name}</h3>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          {platform.sentiment}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{platform.summary}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        💬 {platform.reviewsAnalyzed} reviews analyzed
                      </div>
                      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
                        <p className="text-primary text-sm italic">"{platform.themes[0].quote}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {mockAnalysisData.platforms.map((platform) => (
                    <div key={platform.name} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
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
                            {platform.themes.map((theme) => (
                              <div key={theme.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-300 text-sm">{theme.name}</span>
                                  <span className="text-gray-400 text-xs">{theme.score}%</span>
                                </div>
                                <Progress value={theme.score} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-medium mb-4">Sample Reviews</h4>
                          <div className="space-y-3">
                            {platform.themes.slice(0, 3).map((theme) => (
                              <div key={theme.name} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
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

              {/* Audio Overview Section */}
              {includeAudio && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Volume2 className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-white">Audio Overview</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    AI-generated audio summary covering key insights from {mockAnalysisData.platforms.reduce((acc, p) => acc + p.reviewsAnalyzed, 0)} reviews across all platforms.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={togglePlayback}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <span className="text-sm text-gray-400">
                      2:34 audio summary available
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};