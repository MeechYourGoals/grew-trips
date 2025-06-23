
import React, { useState } from 'react';
import { Globe, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export const UniversalReviewSummaries = () => {
  const [urlInput, setUrlInput] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!urlInput) return;

    setIsLoading(true);
    setError(null);
    setSummary(null);
    setSentiment(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay

    try {
      // Simulate a successful response
      if (urlInput.includes("error")) { // Simulate an error for specific input
        throw new Error("Failed to analyze URL. Please try a different one.");
      }

      const mockSummary = `This is an AI-generated summary for ${urlInput}. Reviews indicate that this place is generally well-liked, particularly for its ambiance and customer service. Some reviews mention that it can get crowded during peak hours.`;
      const mockSentiment = `Positive (85%) - Based on 150 reviews. Key themes: excellent food, friendly staff, cozy atmosphere.`;

      setSummary(mockSummary);
      setSentiment(mockSentiment);

    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl hover:bg-white/15 transition-all duration-300 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-glass-orange/30 to-glass-yellow/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <Globe size={24} className="text-glass-orange" />
        </div>
        <h2 className="text-xl font-semibold text-white">Universal Review Summaries</h2>
      </div>

      {/* URL Input Section */}
      <div className="flex flex-col gap-2">
        <label htmlFor="urlInput" className="text-sm font-medium text-white/80">
          Enter Review URL
        </label>
        <div className="flex gap-2">
          <Input
            id="urlInput"
            type="url"
            placeholder="e.g., yelp.com/biz/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="bg-white/5 border-white/20 placeholder:text-white/40 text-white flex-grow"
          />
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || !urlInput}
            className="bg-gradient-to-r from-glass-orange to-glass-yellow hover:from-glass-orange/80 hover:to-glass-yellow/80 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <Search size={18} />
            Analyze
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-white/80 animate-pulse">Analyzing reviews...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (summary || sentiment) && (
        <div className="space-y-4">
          {summary && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
              <p className="text-white/80 bg-white/5 p-4 rounded-xl text-sm">{summary}</p>
            </div>
          )}
          {sentiment && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Sentiment</h3>
              <p className="text-white/80 bg-white/5 p-4 rounded-xl text-sm">{sentiment}</p>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && !summary && !sentiment && (
         <div className="text-center py-10">
            <Globe size={48} className="text-white/30 mx-auto mb-4" />
            <p className="text-white/60">Enter a URL to see review summaries and sentiment analysis.</p>
         </div>
      )}

    </div>
  );
};
