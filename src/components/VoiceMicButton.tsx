import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';

interface VoiceMicButtonProps {
  onVoiceStart: () => void;
  onVoiceEnd: () => void;
  isRecording: boolean;
  isProcessing: boolean;
  className?: string;
}

export const VoiceMicButton = ({ 
  onVoiceStart, 
  onVoiceEnd, 
  isRecording, 
  isProcessing,
  className = '' 
}: VoiceMicButtonProps) => {
  const handleClick = () => {
    if (isRecording) {
      onVoiceEnd();
    } else {
      onVoiceStart();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isProcessing}
      size="sm"
      variant={isRecording ? "destructive" : "ghost"}
      className={`
        relative h-8 w-8 rounded-full transition-all duration-300
        ${isRecording ? 'animate-pulse bg-destructive hover:bg-destructive/90' : 'hover:bg-muted'}
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isRecording ? (
        <MicOff size={16} className="text-destructive-foreground" />
      ) : (
        <Mic size={16} className="text-muted-foreground" />
      )}
      
      {isProcessing && (
        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      )}
    </Button>
  );
};