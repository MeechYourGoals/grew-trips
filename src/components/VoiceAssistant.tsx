import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, AlertCircle, Settings } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { WhisperService } from '../services/whisperService';
import { ElevenLabsService } from '../services/elevenlabsService';
import { VoiceAssistantService } from '../services/voiceAssistantService';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useParams } from 'react-router-dom';

interface VoiceAssistantProps {
  isProTrip?: boolean;
  className?: string;
}

interface VoiceSession {
  isActive: boolean;
  transcript: string;
  response: string;
  audioUrl?: string;
}

export const VoiceAssistant = ({ isProTrip = false, className = '' }: VoiceAssistantProps) => {
  const { tripId, eventId } = useParams();
  const currentTripId = tripId || eventId || '1';
  
  const { isRecording, isProcessing, error, startRecording, stopRecording, clearError } = useAudioRecorder();
  const [session, setSession] = useState<VoiceSession>({
    isActive: false,
    transcript: '',
    response: '',
  });
  const [isResponding, setIsResponding] = useState(false);
  const [apiKeysConfigured, setApiKeysConfigured] = useState({ openai: false, elevenlabs: false });

  useEffect(() => {
    checkApiKeys();
  }, []);

  const checkApiKeys = async () => {
    const openai = await WhisperService.isApiKeyConfigured();
    const elevenlabs = await ElevenLabsService.isApiKeyConfigured();
    setApiKeysConfigured({ openai, elevenlabs });
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      await handleStopRecording();
    } else {
      await handleStartRecording();
    }
  };

  const handleStartRecording = async () => {
    clearError();
    setSession(prev => ({ ...prev, transcript: '', response: '', audioUrl: undefined }));
    await startRecording();
    setSession(prev => ({ ...prev, isActive: true }));
  };

  const handleStopRecording = async () => {
    try {
      setIsResponding(true);
      const audioBlob = await stopRecording();
      
      // Transcribe audio
      const transcriptionResult = await WhisperService.transcribeAudio(audioBlob);
      
      if (!transcriptionResult.success || !transcriptionResult.text.trim()) {
        setSession(prev => ({ 
          ...prev, 
          isActive: false,
          response: "I couldn't hear you clearly. Please try again." 
        }));
        return;
      }

      setSession(prev => ({ ...prev, transcript: transcriptionResult.text }));

      // Process the query
      const response = await VoiceAssistantService.processVoiceQuery(
        transcriptionResult.text,
        currentTripId,
        isProTrip
      );

      setSession(prev => ({ ...prev, response }));

      // Generate voice response
      if (apiKeysConfigured.elevenlabs) {
        const voiceResult = await ElevenLabsService.synthesizeVoice(response);
        if (voiceResult.success && voiceResult.audioUrl) {
          setSession(prev => ({ ...prev, audioUrl: voiceResult.audioUrl }));
          
          // Auto-play the response
          const audio = new Audio(voiceResult.audioUrl);
          audio.play().catch(console.error);
        }
      }

    } catch (error) {
      console.error('Voice processing error:', error);
      setSession(prev => ({ 
        ...prev, 
        response: "Sorry, I encountered an error processing your request." 
      }));
    } finally {
      setIsResponding(false);
      setSession(prev => ({ ...prev, isActive: false }));
    }
  };

  const playResponse = () => {
    if (session.audioUrl) {
      const audio = new Audio(session.audioUrl);
      audio.play().catch(console.error);
    }
  };

  if (!apiKeysConfigured.openai) {
    return (
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Settings size={20} />
          <div className="text-sm">
            <p className="font-medium mb-1">Voice Assistant Setup Required</p>
            <p>OpenAI API key needed for voice transcription.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Control Button */}
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
        {!isRecording && !isProcessing && !isResponding && (
          <p className="text-muted-foreground">
            Tap microphone to ask about your trip
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-3 bg-destructive/10 border-destructive/20">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle size={16} />
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      )}

      {/* Session Results */}
      {(session.transcript || session.response) && (
        <Card className="p-4 bg-card border-border space-y-3">
          {session.transcript && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">You asked:</p>
              <p className="text-sm text-foreground italic">"{session.transcript}"</p>
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
              <p className="text-sm text-foreground">{session.response}</p>
            </div>
          )}
        </Card>
      )}

      {/* API Status */}
      {!apiKeysConfigured.elevenlabs && session.response && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Add ElevenLabs API key for voice responses
          </p>
        </div>
      )}
    </div>
  );
};