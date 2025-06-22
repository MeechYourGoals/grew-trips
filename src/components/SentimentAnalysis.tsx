
import React from 'react';
import { UniversalReviewSummaries } from './UniversalReviewSummaries';
import { AudioOverviews } from './AudioOverviews';

export const SentimentAnalysis = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Universal Review Summaries - Left Side */}
      <UniversalReviewSummaries />

      {/* Audio Overviews - Right Side */}
      <AudioOverviews />
    </div>
  );
};
