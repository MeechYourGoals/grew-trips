import React from 'react';
import { Compass, Bookmark, TrendingUp, MapPin } from 'lucide-react';
import { SavedRecommendations } from '@/components/SavedRecommendations';

export const CravelRecsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <Compass size={32} className="text-primary" />
          <h1 className="text-3xl font-bold">Chravel Recs</h1>
        </div>
        <p className="text-muted-foreground">
          Discover amazing places, save favorites, and add them to your trips
        </p>
      </div>

      {/* Content Sections */}
      <div className="p-6 space-y-8">
        
        {/* Saved Recommendations */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Bookmark size={20} className="text-primary" />
            <h2 className="text-xl font-semibold">Your Saved Places</h2>
          </div>
          <SavedRecommendations />
        </section>

        {/* Trending Destinations (Placeholder for future implementation) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="text-xl font-semibold">Trending Destinations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted/50 border border-border rounded-xl p-6">
              <p className="text-muted-foreground text-center">Coming Soon</p>
            </div>
          </div>
        </section>

        {/* Nearby Places (Placeholder for future implementation) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-primary" />
            <h2 className="text-xl font-semibold">Nearby Places</h2>
          </div>
          <div className="bg-muted/50 border border-border rounded-xl p-6">
            <p className="text-muted-foreground text-center">Coming Soon</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CravelRecsPage;
