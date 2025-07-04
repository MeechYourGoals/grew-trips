import React, { useState } from 'react';
import { VoiceMicButton } from './VoiceMicButton';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useParams } from 'react-router-dom';

interface VoiceAssistantProps {
  isProTrip?: boolean;
  className?: string;
}

export const VoiceAssistant = ({ isProTrip = false, className = '' }: VoiceAssistantProps) => {
  const { tripId, eventId } = useParams();
  const currentTripId = tripId || eventId || '1';
  const [showModal, setShowModal] = useState(false);
  
  const { isRecording, isProcessing, startRecording, stopRecording } = useAudioRecorder();

  const handleVoiceStart = async () => {
    setShowModal(true);
  };

  const handleVoiceEnd = async () => {
    // Handled in modal
  };

  return (
    <>
      <VoiceMicButton
        onVoiceStart={handleVoiceStart}
        onVoiceEnd={handleVoiceEnd}
        isRecording={isRecording}
        isProcessing={isProcessing}
        className={className}
      />
      
      <VoiceAssistantModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        tripId={currentTripId}
        isProTrip={isProTrip}
      />
    </>
  );
};