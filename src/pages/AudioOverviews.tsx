import React, { useState } from 'react';
import { ArrowLeft, Volume2, Play, Pause, Download, FileText, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { useAudioOverview } from '../hooks/useAiFeatures';

const AudioOverviews = () => {
  const navigate = useNavigate();
  const { isPlus } = useConsumerSubscription();
  const audioOverview = useAudioOverview();
  const [url, setUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // For now, treat Plus users as having Premium access
  const isPremium = isPlus;

  const handleGenerate = () => {
    if (url.trim()) {
      audioOverview.generateAudio(url);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control actual audio playback
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-yellow-500">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold">Audio Overviews</h1>
          </div>
          
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Volume2 size={32} className="text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Premium Feature</h2>
            <p className="text-gray-400 mb-8">This feature is available to Plus/Pro Subscribers</p>
            <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium px-8 py-3">
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
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

          {/* URL Input */}
          <div className="flex gap-4 max-w-2xl">
            <Input
              placeholder="Paste website URL for audio summary..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white flex-1"
            />
            <Button
              onClick={handleGenerate}
              disabled={audioOverview.isLoading || !url.trim()}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium px-6"
            >
              {audioOverview.isLoading ? 'Generating...' : 'Generate Audio'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {audioOverview.result ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Audio Player */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Volume2 size={20} />
                    Audio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Waveform Visualization */}
                  <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-center h-24 mb-4">
                      <Radio size={48} className="text-yellow-500" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={togglePlayback}
                        size="icon"
                        className="bg-yellow-500 text-black hover:bg-yellow-600"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </Button>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(audioOverview.result.duration)}</span>
                        </div>
                        <Progress 
                          value={(currentTime / audioOverview.result.duration) * 100} 
                          className="h-2"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <h3 className="font-medium text-white mb-1">Website Audio Summary</h3>
                      <p className="text-sm text-gray-400">Generated by Google Notebook LM</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        0.5x
                      </Button>
                      <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-500">
                        1x
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        1.5x
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        2x
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transcript */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText size={20} />
                    Full Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed">
                      {audioOverview.result.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Button variant="outline" className="border-gray-600 text-gray-300">
                      <Download size={16} className="mr-2" />
                      Download Transcript
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Audio Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">Duration</div>
                    <div className="text-lg font-semibold text-white">
                      {formatTime(audioOverview.result.duration)}
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
          </div>
        ) : (
          <div className="text-center py-20">
            <Volume2 size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Generate Your First Audio Overview</h3>
            <p className="text-gray-400 mb-6">
              Paste a website URL above and we'll create an AI-powered audio summary using Google Notebook LM
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto text-left">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">1. Paste URL</h4>
                <p className="text-sm text-gray-400">Enter any website URL you want summarized</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">2. AI Analysis</h4>
                <p className="text-sm text-gray-400">Our AI reads and analyzes the content</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">3. Audio Summary</h4>
                <p className="text-sm text-gray-400">Get a natural-sounding audio overview</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioOverviews;
