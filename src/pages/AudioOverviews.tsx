
import React, { useState } from 'react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { useAudioOverview } from '../hooks/useAiFeatures';
import { AudioOverviewsHeader } from '../components/audio/AudioOverviewsHeader';
import { AudioPlayer } from '../components/audio/AudioPlayer';
import { AudioTranscript } from '../components/audio/AudioTranscript';
import { AudioSidebar } from '../components/audio/AudioSidebar';
import { PremiumGate } from '../components/audio/PremiumGate';
import { EmptyState } from '../components/audio/EmptyState';

const AudioOverviews = () => {
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
    return <PremiumGate />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AudioOverviewsHeader
        url={url}
        setUrl={setUrl}
        onGenerate={handleGenerate}
        isLoading={audioOverview.isLoading}
      />

      <div className="max-w-6xl mx-auto p-6">
        {audioOverview.result ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AudioPlayer
                isPlaying={isPlaying}
                onTogglePlayback={togglePlayback}
                currentTime={currentTime}
                duration={audioOverview.result.duration}
                formatTime={formatTime}
              />
              <AudioTranscript summary={audioOverview.result.summary} />
            </div>

            <AudioSidebar
              duration={audioOverview.result.duration}
              url={url}
              formatTime={formatTime}
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default AudioOverviews;
