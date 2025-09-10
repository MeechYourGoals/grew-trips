
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ConsumerSubscriptionProvider } from "./hooks/useConsumerSubscription";
import { MobileAppLayout } from "./components/mobile/MobileAppLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LazyRoute } from "./components/LazyRoute";
import { performanceService } from "./services/performanceService";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const TripDetail = lazy(() => import("./pages/TripDetail"));
const ItineraryAssignmentPage = lazy(() => import("./pages/ItineraryAssignmentPage"));
const ProTripDetail = lazy(() => import("./pages/ProTripDetail"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const JoinTrip = lazy(() => import("./pages/JoinTrip"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const MorePage = lazy(() => import("./pages/MorePage"));
const ArchivePage = lazy(() => import("./pages/ArchivePage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(module => ({ default: module.AdminDashboard })));


const queryClient = new QueryClient();

const App = () => {
  // Track app initialization performance
  const stopTiming = performanceService.startTiming('App Initialization');
  
  React.useEffect(() => {
    stopTiming();
  }, [stopTiming]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ConsumerSubscriptionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <MobileAppLayout>
                  <Routes>
                    <Route path="/" element={
                      <LazyRoute>
                        <Index />
                      </LazyRoute>
                    } />
                    <Route path="/trip/:tripId" element={
                      <LazyRoute>
                        <TripDetail />
                      </LazyRoute>
                    } />
                    <Route path="/trip/:tripId/edit-itinerary" element={
                      <LazyRoute>
                        <ItineraryAssignmentPage />
                      </LazyRoute>
                    } />
                    <Route path="/join/:token" element={
                      <LazyRoute>
                        <JoinTrip />
                      </LazyRoute>
                    } />
                    <Route path="/tour/pro/:proTripId" element={
                      <LazyRoute>
                        <ProTripDetail />
                      </LazyRoute>
                    } />
                    <Route path="/event/:eventId" element={
                      <LazyRoute>
                        <EventDetail />
                      </LazyRoute>
                    } />
                    <Route path="/search" element={
                      <LazyRoute>
                        <SearchPage />
                      </LazyRoute>
                    } />
                    <Route path="/profile" element={
                      <LazyRoute>
                        <ProfilePage />
                      </LazyRoute>
                    } />
                    <Route path="/settings" element={
                      <LazyRoute>
                        <SettingsPage />
                      </LazyRoute>
                    } />
                    <Route path="/more" element={
                      <LazyRoute>
                        <MorePage />
                      </LazyRoute>
                    } />
                    <Route path="/archive" element={
                      <LazyRoute>
                        <ArchivePage />
                      </LazyRoute>
                    } />
                    <Route path="/admin/scheduled-messages" element={
                      <LazyRoute>
                        <AdminDashboard />
                      </LazyRoute>
                    } />
                    <Route path="*" element={
                      <LazyRoute>
                        <NotFound />
                      </LazyRoute>
                    } />
                  </Routes>
                </MobileAppLayout>
              </BrowserRouter>
            </TooltipProvider>
          </ConsumerSubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
