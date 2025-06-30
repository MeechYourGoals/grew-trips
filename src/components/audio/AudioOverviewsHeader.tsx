
import React from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AudioOverviewsHeaderProps {
  url: string;
  setUrl: (url: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const AudioOverviewsHeader = ({ url, setUrl, onGenerate, isLoading }: AudioOverviewsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-yellow-500">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Audio Overviews</h1>
            <p className="text-gray-400">Generate AI-powered audio summaries with Google Notebook LM</p>
          </div>
        </div>

        <div className="flex gap-4 max-w-2xl">
          <Input
            placeholder="Paste website URL for audio summary..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white flex-1"
          />
          <Button
            onClick={onGenerate}
            disabled={isLoading || !url.trim()}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium px-6"
          >
            {isLoading ? 'Generating...' : 'Generate Audio'}
          </Button>
        </div>
      </div>
    </div>
  );
};
