
import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface AnalysisResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  platforms: string[];
}

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Analysis */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Overall Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Overall Score</span>
                <span className="text-2xl font-bold text-yellow-500">{result.score}%</span>
              </div>
              <Progress value={result.score} className="h-3" />
              <p className="text-gray-300 leading-relaxed">{result.text}</p>
            </div>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.platforms.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-yellow-500" />
                    <span className="font-medium">{platform}</span>
                  </div>
                  <ExternalLink size={16} className="text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Sidebar */}
      <div className="space-y-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">142</div>
              <div className="text-sm text-gray-400">Reviews Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{result.score}%</div>
              <div className="text-sm text-gray-400">Positive Sentiment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">4.2</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Themes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {['Service Quality', 'Food Quality', 'Atmosphere', 'Value for Money'].map((theme, index) => (
              <div key={theme} className="flex items-center justify-between">
                <span className="text-gray-300">{theme}</span>
                <div className="flex items-center gap-2">
                  <Progress value={85 - index * 10} className="w-16 h-2" />
                  <span className="text-sm text-gray-400">{85 - index * 10}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
