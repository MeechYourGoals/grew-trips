
import React, { useState } from 'react';
import { Brain, Link, Star, TrendingUp, MessageSquare, Award, Volume2 } from 'lucide-react';

interface PlatformData {
  count: number;
  sentiment: number;
}

interface ResultsData {
  platforms: {
    google: PlatformData;
    yelp: PlatformData;
    facebook: PlatformData;
  };
  themes: {
    service: number;
    food: number;
    atmosphere: number;
    value: number;
  };
  overallScore: number;
  totalReviews: number;
}

export const SentimentAnalysis = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    
    setIsLoading(true);
    // Simulate API call - will implement Perplexity integration later
    setTimeout(() => {
      setResults({
        platforms: {
          google: { count: 247, sentiment: 4.2 },
          yelp: { count: 89, sentiment: 4.1 },
          facebook: { count: 156, sentiment: 4.4 }
        },
        themes: {
          service: 85,
          food: 78,
          atmosphere: 92,
          value: 71
        },
        overallScore: 4.2,
        totalReviews: 492
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    // Simulate Google Notebook LM audio generation
    setTimeout(() => {
      setIsGeneratingAudio(false);
      // This would trigger audio playback in real implementation
      console.log('Audio overview generated');
    }, 3000);
  };

  return (
    <div className="bg-black border border-red-600/30 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Brain size={24} className="text-red-400" />
        <h2 className="text-2xl font-bold text-white">Review Summaries</h2>
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-2 py-1 rounded-full">
          PREMIUM
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-6 leading-relaxed">
        Analyze reviews from any platform to get instant insights about destinations, restaurants, and attractions.
      </p>

      {/* URL Input Field */}
      <div className="mb-4">
        <div className="relative">
          <Link size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste URL from Yelp, Google, TripAdvisor, Facebook..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>

      {/* Analyze Button */}
      <button 
        onClick={handleAnalyze}
        disabled={!url.trim() || isLoading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white py-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg mb-6 flex items-center justify-center gap-2 border border-red-500/30"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Analyzing...
          </>
        ) : (
          <>
            <Brain size={18} />
            Analyze Reviews
          </>
        )}
      </button>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Audio Overview Premium Feature */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-600/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 size={18} className="text-yellow-400" />
                <h3 className="text-lg font-semibold text-yellow-400">Audio Overview</h3>
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-2 py-1 rounded-full">
                  PREMIUM
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Get an AI-powered audio summary of all reviews using Google Notebook LM
            </p>
            <button 
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-700/50 text-black font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {isGeneratingAudio ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Generating Audio...
                </>
              ) : (
                <>
                  <Volume2 size={16} />
                  Generate Audio Summary
                </>
              )}
            </button>
          </div>

          {/* Overall Score */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Overall Rating</h3>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span className="text-2xl font-bold text-yellow-400">{results.overallScore}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{results.totalReviews} total reviews analyzed</p>
          </div>

          {/* Platform Breakdown */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <MessageSquare size={18} className="text-red-400" />
              Platform Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(results.platforms).map(([platform, data]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-red-400 font-bold text-sm uppercase">
                        {platform.charAt(0)}
                      </span>
                    </div>
                    <span className="text-white capitalize">{platform}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">{data.count} reviews</span>
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 fill-current" size={14} />
                      <span className="text-yellow-400 font-semibold">{data.sentiment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Analysis */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-yellow-400" />
              Theme Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(results.themes).map(([theme, score]) => (
                <div key={theme} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white capitalize">{theme}</span>
                    <span className="text-yellow-400 font-semibold">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-yellow-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Award size={18} className="text-red-400" />
              Key Insights
            </h3>
            <div className="space-y-3">
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-semibold text-sm">POSITIVE</span>
                </div>
                <p className="text-gray-300 text-sm">"Amazing atmosphere and exceptional service. Will definitely come back!"</p>
              </div>
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-red-400 font-semibold text-sm">CONCERN</span>
                </div>
                <p className="text-gray-300 text-sm">"Prices are a bit high for the portion sizes, but quality is good."</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!results && !isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm">
            Paste a URL to analyze reviews and get instant insights.
          </div>
        </div>
      )}
    </div>
  );
};
