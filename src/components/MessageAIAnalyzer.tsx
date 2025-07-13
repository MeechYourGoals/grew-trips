import React, { useEffect, useState } from 'react';
import { AICalendarDetector } from './AICalendarDetector';
import { AddToCalendarData } from '../types/calendar';

interface MessageAIAnalyzerProps {
  messageText: string;
  onEventAdded?: (eventData: AddToCalendarData) => void;
}

export const MessageAIAnalyzer = ({ messageText, onEventAdded }: MessageAIAnalyzerProps) => {
  const [shouldAnalyze, setShouldAnalyze] = useState(false);

  useEffect(() => {
    // Trigger analysis for messages that might contain calendar information
    const triggerKeywords = [
      'reservation', 'booking', 'confirmed', 'ticket', 'flight', 'hotel',
      'restaurant', 'dinner', 'check-in', 'confirmation', 'opentable',
      'resy', 'airbnb', 'uber', 'lyft', 'concert', 'show', 'event'
    ];

    const hasCalendarKeywords = triggerKeywords.some(keyword => 
      messageText.toLowerCase().includes(keyword)
    );

    setShouldAnalyze(hasCalendarKeywords);
  }, [messageText]);

  if (!shouldAnalyze) {
    return null;
  }

  return (
    <div className="mt-3">
      <AICalendarDetector
        messageText={messageText}
        onEventAdded={onEventAdded}
        onDismiss={() => setShouldAnalyze(false)}
      />
    </div>
  );
};