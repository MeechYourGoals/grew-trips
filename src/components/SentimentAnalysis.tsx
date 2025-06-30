
import React from 'react';
import { AiFeatureCard } from './AiFeatureCard';

export const SentimentAnalysis = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      {/* Universal Review Summaries - Left Side */}
      <AiFeatureCard feature="reviews" planRequired="plus" />

      {/* Audio Overviews - Right Side */}
      <AiFeatureCard feature="audio" planRequired="premium" />
    </div>
  );
};
