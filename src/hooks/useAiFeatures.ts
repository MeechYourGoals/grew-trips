
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AiFeatureService, ReviewAnalysisResult, AudioOverviewResult } from '../services/aiFeatures';

export const useReviewAnalysis = () => {
  const [result, setResult] = useState<ReviewAnalysisResult | null>(null);
  
  const mutation = useMutation({
    mutationFn: (url: string) => AiFeatureService.analyzeReviews(url),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setResult(response.data);
      }
    },
  });

  return {
    analyzeReviews: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error?.message || (mutation.data?.error),
    result,
    clearResult: () => setResult(null),
  };
};

export const useAudioOverview = () => {
  const [result, setResult] = useState<AudioOverviewResult | null>(null);
  
  const mutation = useMutation({
    mutationFn: (url: string) => AiFeatureService.generateAudioOverview(url),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setResult(response.data);
      }
    },
  });

  return {
    generateAudio: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error?.message || (mutation.data?.error),
    result,
    clearResult: () => setResult(null),
  };
};
