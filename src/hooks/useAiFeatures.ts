
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AiFeatureService, ReviewAnalysisResult } from '../services/aiFeatures';
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

// Simplified hook that only handles text analysis
export const useReviewSummary = () => {
  const reviewAnalysis = useReviewAnalysis();
  
  const generateSummary = (venueData: any) => {
    // Handle both string URLs and venue objects
    const query = typeof venueData === 'string' ? venueData : venueData.name;
    reviewAnalysis.analyzeReviews(query);
  };

  return {
    generateSummary,
    textResult: reviewAnalysis.result,
    isLoading: reviewAnalysis.isLoading,
    error: reviewAnalysis.error,
    clearResults: () => {
      reviewAnalysis.clearResult();
    }
  };
};
