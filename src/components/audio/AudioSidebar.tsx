
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AudioSidebarProps {
  duration: number;
  url: string;
  formatTime: (seconds: number) => string;
}

export const AudioSidebar = ({ duration, url, formatTime }: AudioSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Audio Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-gray-400">Duration</div>
            <div className="text-lg font-semibold text-white">
              {formatTime(duration)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Generated</div>
            <div className="text-sm text-white">Just now</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Source</div>
            <div className="text-sm text-blue-400 truncate">{url}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Key Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['Introduction', 'Main Features', 'Benefits', 'Conclusion'].map((topic, index) => (
              <div key={topic} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <span className="text-sm text-gray-300">{topic}</span>
                <span className="text-xs text-gray-500">{formatTime(index * 30)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-500/10 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="text-yellow-500">Powered by Notebook LM</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300">
            This audio overview was generated using Google's Notebook LM technology, 
            providing natural-sounding AI narration of your content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
