import React, { useState, useRef } from 'react';
import { BarChart3, RefreshCw, Volume2, Play, Pause, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { useReviewAnalysis, useAudioOverview } from '../hooks/useAiFeatures';
import { PremiumBadge } from './PremiumBadge';
import { AnalysisResults } from './review/AnalysisResults';

interface TripReviewSummariesProps {
  tripId?: string;
  className?: string;
}

export const TripReviewSummaries = ({ tripId, className = "" }: TripReviewSummariesProps) => {
  const reviewAnalysis = useReviewAnalysis();
  const audioOverview = useAudioOverview();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [venueName, setVenueName] = useState('');
  const [venueUrl, setVenueUrl] = useState('');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [placesService, setPlacesService] = useState<any>(null);

  // Initialize Google Places service
  React.useEffect(() => {
    if (window.google && window.google.maps) {
      const service = new window.google.maps.places.AutocompleteService();
      setPlacesService(service);
    }
  }, []);

  const handleVenueNameChange = (value: string) => {
    setVenueName(value);
    
    if (value.length > 2 && placesService) {
      placesService.getPlacePredictions(
        {
          input: value,
          types: ['establishment'],
        },
        (predictions: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions.slice(0, 5));
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

  const handlePredictionSelect = (prediction: any) => {
    setVenueName(prediction.description);
    setShowPredictions(false);
    setPredictions([]);
  };

  const handleAnalyze = () => {
    const targetUrl = venueUrl.trim() || venueName;
    
    if (targetUrl) {
      reviewAnalysis.analyzeReviews(targetUrl);
      if (includeAudio) {
        audioOverview.generateAudio(targetUrl, tripId);
      }
    }
  };

  const handleRefresh = () => {
    reviewAnalysis.clearResult();
    audioOverview.clearResult();
    setVenueName('');
    setVenueUrl('');
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

  const isAnalyzing = reviewAnalysis.isLoading || audioOverview.isLoading;
  const hasResults = reviewAnalysis.result || audioOverview.result;

  return (
    <Card className={`bg-gray-900/50 border-gray-800 backdrop-blur-sm ${className}`}>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-white text-xl">Review & Audio Summaries</CardTitle>
          </div>
          <PremiumBadge />
        </div>
        <p className="text-gray-400 text-sm">
          Get instant AI text & audio overviews for any restaurant or place—try as a demo, full access for subscribers.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              value={venueName}
              onChange={(e) => handleVenueNameChange(e.target.value)}
              placeholder="Enter venue name (e.g., Artisan Coffee House)"
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />
            {showPredictions && predictions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-white text-sm"
                    onClick={() => handlePredictionSelect(prediction)}
                  >
                    {prediction.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input
            value={venueUrl}
            onChange={(e) => setVenueUrl(e.target.value)}
            placeholder="Or enter direct URL (Yelp, TripAdvisor, etc.)"
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={includeAudio}
                onCheckedChange={setIncludeAudio}
                id="include-audio"
              />
              <label htmlFor="include-audio" className="text-sm text-gray-300">
                Include audio overview
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                disabled={isAnalyzing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleAnalyze}
                size="sm"
                className="bg-primary hover:bg-primary/90"
                disabled={!venueName.trim() && !venueUrl.trim() || isAnalyzing}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Reviews'}
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {hasResults && (
          <div className="space-y-6 pt-4 border-t border-gray-800">
            {reviewAnalysis.result && (
              <AnalysisResults result={reviewAnalysis.result} />
            )}

            {audioOverview.result && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-white">Audio Overview</h3>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-300 text-sm mb-4">{audioOverview.result.summary}</p>
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
                      {audioOverview.result.duration}s audio summary
                    </span>
                  </div>
                  {audioOverview.result.audioUrl && (
                    <audio
                      ref={audioRef}
                      src={audioOverview.result.audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error States */}
        {reviewAnalysis.error && (
          <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            Review Analysis Error: {reviewAnalysis.error}
          </div>
        )}
        {audioOverview.error && (
          <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            Audio Overview Error: {audioOverview.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};