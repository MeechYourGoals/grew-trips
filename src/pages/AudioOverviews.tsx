
import React, { useState, useRef } from 'react';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { useAudioOverview } from '../hooks/useAiFeatures';
import { AudioOverviewsHeader } from '../components/audio/AudioOverviewsHeader';
import { AudioPlayer } from '../components/audio/AudioPlayer';
import { AudioTranscript } from '../components/audio/AudioTranscript';
import { AudioSidebar } from '../components/audio/AudioSidebar';
import { PremiumGate } from '../components/audio/PremiumGate';
import { EmptyState } from '../components/audio/EmptyState';
import { useToast } from '../hooks/use-toast';

const AudioOverviews = () => {
  const { isPlus } = useConsumerSubscription();
  const audioOverview = useAudioOverview();
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // For now, treat Plus users as having Premium access
  const isPremium = isPlus;

  const handleGenerate = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to generate audio summary",
        variant: "destructive"
      });
      return;
    }

    try {
      // Extract trip ID from current context if available
      const tripId = new URLSearchParams(window.location.search).get('tripId') || undefined;
      audioOverview.generateAudio(url, tripId);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate audio summary. Please try again.",
        variant: "destructive"
      });
    }
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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(Math.floor(audioRef.current.currentTime));
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
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
        {audioOverview.error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-300">{audioOverview.error}</p>
          </div>
        )}

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
              
              {/* Hidden audio element for actual playback */}
              <audio
                ref={audioRef}
                src={audioOverview.result.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleAudioEnded}
                preload="metadata"
              />
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
