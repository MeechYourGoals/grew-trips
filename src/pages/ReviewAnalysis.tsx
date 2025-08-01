
import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, MessageSquare, Sparkles, RefreshCw, Check, X, Edit2, Volume2, Play, Pause } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useReviewAnalysis } from '../hooks/useAiFeatures';
import { ReviewAnalysisHeader } from '../components/review/ReviewAnalysisHeader';
import { AnalysisResults } from '../components/review/AnalysisResults';
import { ReviewChat } from '../components/review/ReviewChat';
import { ReviewEmptyState } from '../components/review/ReviewEmptyState';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const ReviewAnalysis = () => {
  const navigate = useNavigate();
  const reviewAnalysis = useReviewAnalysis();
  
  const [urls, setUrls] = useState({
    google: '',
    yelp: '',
    facebook: '',
    tripadvisor: ''
  });
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [venueName, setVenueName] = useState('Artisan Coffee House');
  const [activeView, setActiveView] = useState<'overview' | 'platform'>('overview');
  const [isEditingVenue, setIsEditingVenue] = useState(false);
  const [tempVenueName, setTempVenueName] = useState('');
  const [venueUrl, setVenueUrl] = useState('');
  const [placesService, setPlacesService] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);

  const handleAnalyze = () => {
    // Use venue URL if provided, otherwise try to generate analysis from venue name
    const targetUrl = venueUrl.trim() || venueName;
    const allUrls = Object.values(urls).filter(url => url.trim());
    const analysisTarget = allUrls.length > 0 ? allUrls.join(',') : targetUrl;
    
    if (analysisTarget) {
      reviewAnalysis.analyzeReviews(analysisTarget);
    }
  };


  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    
    // Mock AI response for demo
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on the review analysis, I can see that ${chatInput.toLowerCase()} is mentioned frequently. The sentiment around this topic appears to be generally positive with a few areas for improvement. Would you like me to elaborate on specific aspects?`
      }]);
    }, 1000);
    
    setChatInput('');
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

  // Mock data matching the screenshots
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
    <div className="min-h-screen bg-black text-white">
      {/* Header matching screenshot style */}
      <div className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-yellow-500">
                <ArrowLeft size={20} />
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <BarChart3 size={24} className="text-white" />
                  <h1 className="text-xl font-bold">AI Review Summaries</h1>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Premium</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:text-white"
                onClick={() => {
                  reviewAnalysis.clearResult?.();
                  setUrls({ google: '', yelp: '', facebook: '', tripadvisor: '' });
                  setVenueUrl('');
                }}
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleAnalyze}
                disabled={reviewAnalysis.isLoading}
              >
                <Sparkles size={16} className="mr-2" />
                {reviewAnalysis.isLoading ? 'Analyzing...' : 'Analyze Reviews'}
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Last updated: 6/30/2025, 3:16:52 PM</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Venue Name Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6">
          <h3 className="text-gray-400 text-sm mb-2">Venue Name for Analysis</h3>
          
          {!isEditingVenue ? (
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-white">{venueName}</h2>
              <button 
                onClick={handleEditVenue}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Edit2 size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-4 mb-4 relative">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={tempVenueName}
                    onChange={(e) => handleVenueSearch(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
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
                <button
                  onClick={handleSaveVenue}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* URL Input Field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">
              Review URL (optional)
            </label>
            <input
              type="url"
              value={venueUrl}
              onChange={(e) => setVenueUrl(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="https://example.com/venue-reviews"
            />
          </div>

          
          <p className="text-gray-400 text-sm">Change the venue name to analyze competitor sentiment or compare different locations</p>
        </div>

        {/* Platform Toggle */}
        <div className="flex gap-4 mb-6">
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
            {mockAnalysisData.platforms.map((platform, index) => (
              <div key={platform.name} className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
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
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                  <p className="text-purple-300 text-sm italic">"{platform.themes[0].quote}"</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {mockAnalysisData.platforms.map((platform, index) => (
              <div key={platform.name} className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      {platform.sentiment}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    🔗
                  </button>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">{platform.summary}</p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-white font-semibold mb-4">Theme Breakdown</h4>
                    <div className="space-y-4">
                      {platform.themes.map((theme) => (
                        <div key={theme.name}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300 font-medium">{theme.name}</span>
                            <span className="text-green-400 text-sm">+{theme.score}%</span>
                          </div>
                          <div className="bg-gray-800 rounded-full h-2 mb-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${theme.score}%` }}
                            />
                          </div>
                          <p className="text-gray-400 text-sm italic">"{theme.quote}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-4">Quick Stats</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Reviews Analyzed</span>
                        <span className="text-white font-bold">{platform.reviewsAnalyzed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="text-white">6/30/2025</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Sentiment Score</span>
                        <span className="text-green-400 font-bold">{platform.sentimentScore}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Positive Reviews</span>
                        <span className="text-green-400 font-bold">{platform.positiveReviews}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading States */}
        {reviewAnalysis.isLoading && (
          <Card className="bg-gray-900 border-gray-700 mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <RefreshCw className="animate-spin" size={20} />
                <div>
                  <p className="text-white font-medium">Analyzing reviews...</p>
                  <p className="text-gray-400 text-sm">This may take a moment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReviewAnalysis;
