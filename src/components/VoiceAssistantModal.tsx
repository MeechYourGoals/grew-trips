import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Mic, MicOff, Volume2, X } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { TripContextService } from '../services/tripContextService';

interface VoiceSession {
  transcription: string;
  response: string;
  audioUrl?: string;
  isComplete: boolean;
}

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  isProTrip?: boolean;
}

export const VoiceAssistantModal = ({ 
  isOpen, 
  onClose, 
  tripId, 
  isProTrip = false 
}: VoiceAssistantModalProps) => {
  const { isRecording, isProcessing, error, startRecording, stopRecording, clearError } = useAudioRecorder();
  const [session, setSession] = useState<VoiceSession | null>(null);
  const [isResponding, setIsResponding] = useState(false);

  const handleVoiceToggle = async () => {
    if (isRecording) {
      await handleStopRecording();
    } else {
      await handleStartRecording();
    }
  };

  const handleStartRecording = async () => {
    clearError();
    setSession(null);
    await startRecording();
  };

  const handleStopRecording = async () => {
    try {
      setIsResponding(true);
      const audioBlob = await stopRecording();
      
      // Get trip context
      const context = await TripContextService.getTripContext(tripId, isProTrip);
      
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Call voice assistant edge function
      const response = await fetch('/functions/v1/voice-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioBlob: base64Audio,
          tripId,
          isProTrip,
          tripContext: context
        }),
      });

      if (!response.ok) {
        throw new Error('Voice processing failed');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Voice processing failed');
      }

      const newSession: VoiceSession = {
        transcription: data.transcription || '',
        response: data.response || '',
        audioUrl: data.audioUrl,
        isComplete: true
      };

      setSession(newSession);

      // Auto-play response if audio is available
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play().catch(console.error);
      }

    } catch (error) {
      console.error('Voice processing error:', error);
      setSession({
        transcription: '',
        response: 'Sorry, something went wrong. Please try again.',
        isComplete: true
      });
    } finally {
      setIsResponding(false);
    }
  };

  const playResponse = () => {
    if (session?.audioUrl) {
      const audio = new Audio(session.audioUrl);
      audio.play().catch(console.error);
    }
  };

  const resetSession = () => {
    setSession(null);
    clearError();
  };

  useEffect(() => {
    if (!isOpen) {
      resetSession();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic size={20} className="text-primary" />
            AI Voice Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Voice Control */}
          <div className="flex justify-center">
            <Button
              onClick={handleVoiceToggle}
              disabled={isProcessing || isResponding}
              size="lg"
              className={`
                relative h-16 w-16 rounded-full transition-all duration-300
                ${isRecording 
                  ? 'bg-destructive hover:bg-destructive/90 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
                }
                ${(isProcessing || isResponding) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isRecording ? (
                <MicOff size={24} className="text-primary-foreground" />
              ) : (
                <Mic size={24} className="text-primary-foreground" />
              )}
              
              {(isProcessing || isResponding) && (
                <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              )}
            </Button>
          </div>

          {/* Status Text */}
          <div className="text-center">
            {isRecording && (
              <p className="text-primary font-medium animate-pulse">
                Listening... Tap to stop
              </p>
            )}
            {isProcessing && (
              <p className="text-muted-foreground">
                Processing audio...
              </p>
            )}
            {isResponding && (
              <p className="text-muted-foreground">
                Thinking...
              </p>
            )}
            {!isRecording && !isProcessing && !isResponding && !session && (
              <p className="text-muted-foreground">
                Tap microphone to ask about your trip
              </p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Session Results */}
          {session && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              {session.transcription && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">You asked:</p>
                  <p className="text-sm italic">"{session.transcription}"</p>
                </div>
              )}
              
              {session.response && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-muted-foreground">AI Response:</p>
                    {session.audioUrl && (
                      <Button
                        onClick={playResponse}
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                      >
                        <Volume2 size={12} />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{session.response}</p>
                </div>
              )}
              
              <Button
                onClick={resetSession}
                variant="outline"
                size="sm"
                className="w-full mt-3"
              >
                Ask Another Question
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};