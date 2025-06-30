
import React from 'react';
import { ArrowLeft, Globe, MessageSquare, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ReviewAnalysisHeaderProps {
  urls: {
    google: string;
    yelp: string;
    facebook: string;
    tripadvisor: string;
  };
  setUrls: (urls: { google: string; yelp: string; facebook: string; tripadvisor: string; }) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const ReviewAnalysisHeader = ({ urls, setUrls, onAnalyze, isLoading }: ReviewAnalysisHeaderProps) => {
  const navigate = useNavigate();

  const platforms = [
    { key: 'google', name: 'Google Reviews', icon: Globe, color: 'text-blue-400' },
    { key: 'yelp', name: 'Yelp', icon: Star, color: 'text-red-400' },
    { key: 'facebook', name: 'Facebook', icon: MessageSquare, color: 'text-blue-500' },
    { key: 'tripadvisor', name: 'TripAdvisor', icon: TrendingUp, color: 'text-green-400' }
  ];

  return (
    <div className="border-b border-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-yellow-500">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Universal Review Summaries</h1>
            <p className="text-gray-400">Analyze reviews from multiple platforms with AI</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {platforms.map(({ key, name, icon: Icon, color }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon size={16} className={color} />
                <label className="text-sm font-medium">{name}</label>
              </div>
              <Input
                placeholder={`${name} URL`}
                value={urls[key as keyof typeof urls]}
                onChange={(e) => setUrls({ ...urls, [key]: e.target.value })}
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
          ))}
        </div>

        <Button
          onClick={onAnalyze}
          disabled={isLoading || !Object.values(urls).some(url => url.trim())}
          className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium px-8 py-3"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Reviews'}
        </Button>
      </div>
    </div>
  );
};
