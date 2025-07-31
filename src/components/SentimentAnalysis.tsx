
import React from 'react';
import { AiFeatureCard } from './AiFeatureCard';

export const SentimentAnalysis = () => {
  return (
    <div className="flex justify-center w-full">
      <div className="max-w-md w-full">
        <AiFeatureCard feature="reviews" planRequired="plus" />
      </div>
    </div>
  );
};
