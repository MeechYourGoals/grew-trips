
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AiFeatureService, ReviewAnalysisResult, AudioOverviewResult } from '../services/aiFeatures';
import { useAuth } from './useAuth';

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
  const { user } = useAuth();
  
  const mutation = useMutation({
    mutationFn: ({ url, tripId }: { url: string; tripId?: string }) => 
      AiFeatureService.generateAudioOverview(url, user?.id, tripId),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setResult(response.data);
      }
    },
  });

  return {
    generateAudio: (url: string, tripId?: string) => mutation.mutate({ url, tripId }),
    isLoading: mutation.isPending,
    error: mutation.error?.message || (mutation.data?.error),
    result,
    clearResult: () => setResult(null),
  };
};

// Unified hook that combines both text and audio analysis
export const useReviewSummary = () => {
  const reviewAnalysis = useReviewAnalysis();
  const audioOverview = useAudioOverview();
  
  const generateSummary = (url: string, options: { includeAudio?: boolean; tripId?: string } = {}) => {
    reviewAnalysis.analyzeReviews(url);
    if (options.includeAudio) {
      audioOverview.generateAudio(url, options.tripId);
    }
  };

  return {
    generateSummary,
    textResult: reviewAnalysis.result,
    audioResult: audioOverview.result,
    isLoadingText: reviewAnalysis.isLoading,
    isLoadingAudio: audioOverview.isLoading,
    isLoading: reviewAnalysis.isLoading || audioOverview.isLoading,
    textError: reviewAnalysis.error,
    audioError: audioOverview.error,
    error: reviewAnalysis.error || audioOverview.error,
    clearResults: () => {
      reviewAnalysis.clearResult();
      audioOverview.clearResult();
    }
  };
};
