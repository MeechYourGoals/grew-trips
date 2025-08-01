import React, { useState } from 'react';
import { BarChart3, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { PremiumBadge } from './PremiumBadge';
import { ReviewAnalysisModal } from './ReviewAnalysisModal';

interface TripReviewSummariesProps {
  tripId?: string;
  className?: string;
}

export const TripReviewSummaries = ({ tripId, className = "" }: TripReviewSummariesProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className={`bg-gray-900/50 border-gray-800 backdrop-blur-sm ${className}`}>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-white text-xl">Concierge Review Summaries</CardTitle>
            </div>
            <PremiumBadge />
          </div>
          <p className="text-gray-400 text-sm">
            Get instant AI-powered insights and review summaries for any restaurant or place—try as a demo, full access for subscribers.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-gray-300">
              Analyze reviews from Google, Yelp, Facebook and more with AI-powered insights and detailed summaries.
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analyze Reviews
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReviewAnalysisModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        tripId={tripId}
      />
    </>
  );
};