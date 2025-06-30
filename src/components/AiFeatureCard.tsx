
import React, { useState } from 'react';
import { Globe, Volume2, Lock, Play, Pause, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useTripVariant } from '../contexts/TripVariantContext';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { useReviewAnalysis, useAudioOverview } from '../hooks/useAiFeatures';
import { validateUrl, extractPlaceInfo } from '../services/aiFeatures';

interface AiFeatureCardProps {
  feature: 'reviews' | 'audio';
  planRequired: 'plus' | 'premium';
}

export const AiFeatureCard = ({ feature, planRequired }: AiFeatureCardProps) => {
  const { accentColors } = useTripVariant();
  const { isPlus, upgradeToPlus } = useConsumerSubscription();
  const [url, setUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // For now, consider Plus users as having Premium access too
  const isPremium = isPlus; // TODO: Implement proper premium tier detection
  const hasAccess = (planRequired === 'plus' && isPlus) || (planRequired === 'premium' && isPremium);

  const reviewAnalysis = useReviewAnalysis();
  const audioOverview = useAudioOverview();

  const handleAnalyze = () => {
    if (!validateUrl(url)) {
      alert('Please enter a valid URL');
      return;
    }

    if (feature === 'reviews') {
      reviewAnalysis.analyzeReviews(url);
    } else {
      audioOverview.generateAudio(url);
    }
  };

  const getSentimentColor = (sentiment: string, score: number) => {
    if (sentiment === 'positive') return 'text-green-400';
    if (sentiment === 'negative') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentEmoji = (sentiment: string) => {
    if (sentiment === 'positive') return '😊';
    if (sentiment === 'negative') return '😞';
    return '😐';
  };

  const config = {
    reviews: {
      icon: Globe,
      title: 'Universal Review Summaries',
      description: hasAccess 
        ? 'Get AI summaries from Yelp, TripAdvisor, OpenTable, Instagram, TikTok, Facebook, and more'
        : 'Upgrade to Plus to analyze reviews from any platform',
      placeholder: 'Paste restaurant or venue URL...'
    },
    audio: {
      icon: Volume2,
      title: 'Audio Overviews',
      description: hasAccess
        ? 'Generate AI-powered audio summaries using Google Notebook LM'
        : 'Upgrade to premium to access audio summaries',
      placeholder: 'Paste website URL for audio summary...'
    }
  };

  const currentConfig = config[feature];
  const Icon = currentConfig.icon;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl hover:bg-white/15 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-r from-${accentColors.primary}/30 to-${accentColors.secondary}/30 backdrop-blur-sm rounded-xl flex items-center justify-center`}>
          <Icon size={24} className={`text-${accentColors.primary}`} />
        </div>
        <h2 className="text-xl font-semibold text-white">{currentConfig.title}</h2>
        <span className={`bg-gradient-to-r from-${accentColors.primary}/20 to-${accentColors.secondary}/20 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-1 rounded-full`}>
          {planRequired === 'plus' ? 'Plus Required' : 'Premium Required'}
        </span>
      </div>

      {hasAccess ? (
        <div className="space-y-6">
          {/* Input Section */}
          <div className="space-y-3">
            <Input
              type="url"
              placeholder={currentConfig.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button
              onClick={handleAnalyze}
              disabled={!url || reviewAnalysis.isLoading || audioOverview.isLoading}
              className={`w-full bg-gradient-to-r ${accentColors.gradient} hover:from-${accentColors.primary}/80 hover:to-${accentColors.secondary}/80 text-white font-medium py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg`}
            >
              {(reviewAnalysis.isLoading || audioOverview.isLoading) ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </div>

          {/* Results Section */}
          {feature === 'reviews' && reviewAnalysis.result && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Review Summary</h3>
                <div className={`flex items-center gap-2 ${getSentimentColor(reviewAnalysis.result.sentiment, reviewAnalysis.result.score)}`}>
                  <span className="text-lg">{getSentimentEmoji(reviewAnalysis.result.sentiment)}</span>
                  <span className="font-medium capitalize">{reviewAnalysis.result.sentiment}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-white/70 mb-1">
                    <span>Sentiment Score</span>
                    <span>{reviewAnalysis.result.score}%</span>
                  </div>
                  <Progress 
                    value={reviewAnalysis.result.score} 
                    className="h-2"
                  />
                </div>
                
                <p className="text-white/90 leading-relaxed">{reviewAnalysis.result.text}</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-white/60">Sources:</span>
                  {reviewAnalysis.result.platforms.map((platform, index) => (
                    <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded-lg text-white/80">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {feature === 'audio' && audioOverview.result && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Audio Overview</h3>
              
              {/* Audio Player */}
              <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  size="icon"
                  className={`bg-gradient-to-r ${accentColors.gradient} hover:from-${accentColors.primary}/80 hover:to-${accentColors.secondary}/80`}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-white/70 mb-1">
                    <span>Audio Summary</span>
                    <span>{Math.floor(audioOverview.result.duration / 60)}:{(audioOverview.result.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
              
              {/* Transcript */}
              <details className="bg-white/5 rounded-xl">
                <summary className="p-4 cursor-pointer text-white/80 hover:text-white transition-colors">
                  View Transcript
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-white/90 leading-relaxed">{audioOverview.result.summary}</p>
                </div>
              </details>
            </div>
          )}

          {/* Error Display */}
          {(reviewAnalysis.error || audioOverview.error) && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400" />
              <p className="text-red-300">
                {reviewAnalysis.error || audioOverview.error}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Center Icon */}
          <div className="flex justify-center mb-8 mt-12">
            <div className="w-20 h-20 border-2 border-white/30 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Lock size={32} className="text-white/60" />
            </div>
          </div>

          {/* Upgrade Message */}
          <div className="text-center mb-8">
            <h3 className="text-xl text-white/90 mb-4 font-medium">
              {currentConfig.description}
            </h3>
          </div>

          {/* Upgrade Button */}
          <div className="flex justify-center">
            <button
              onClick={upgradeToPlus}
              className={`bg-gradient-to-r ${accentColors.gradient} hover:from-${accentColors.primary}/80 hover:to-${accentColors.secondary}/80 text-white font-medium px-8 py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg`}
            >
              Upgrade to {planRequired === 'plus' ? 'Plus' : 'Premium'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
