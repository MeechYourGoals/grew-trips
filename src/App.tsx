
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import { AuthProvider } from "./hooks/useAuth";
import { ConsumerSubscriptionProvider } from "./hooks/useConsumerSubscription";
import Index from "./pages/Index";
import TripDetail from "./pages/TripDetail";
import ItineraryAssignmentPage from "./pages/ItineraryAssignmentPage";
import ProTripDetail from "./pages/ProTripDetail";
import EventDetail from "./pages/EventDetail";
import ReviewAnalysis from "./pages/ReviewAnalysis";
import AudioOverviews from "./pages/AudioOverviews";
import NotFound from "./pages/NotFound";
import JoinTrip from "./pages/JoinTrip";
import { AdminDashboard } from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => {
  // Initialize theme on app start
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to light mode unless explicitly set to dark
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConsumerSubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/trip/:tripId" element={<TripDetail />} />
              <Route path="/trip/:tripId/edit-itinerary" element={<ItineraryAssignmentPage />} />
              {/* Join trip route */}
              <Route path="/join/:token" element={<JoinTrip />} />
              {/* Pro trip routes - Fixed pattern to properly match URLs like /tour/pro-2 */}
              <Route path="/tour/pro/:proTripId" element={<ProTripDetail />} />
              {/* Events routes - New routes for Events functionality */}
              <Route path="/event/:eventId" element={<EventDetail />} />
              {/* AI Feature routes */}
              <Route path="/ai/review-analysis" element={<ReviewAnalysis />} />
              <Route path="/ai/audio-overviews" element={<AudioOverviews />} />
              <Route path="/admin/scheduled-messages" element={<AdminDashboard />} />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ConsumerSubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
