import React from 'react';
import ScheduledMessagesDashboard from '@/components/admin/ScheduledMessagesDashboard'; // Will create this next
import { useParams } from 'react-router-dom'; // If tripId is from URL

const AdminScheduledMessagesPage: React.FC = () => {
  // Example: If tripId is part of the route /trip/:tripId/admin/scheduled-messages
  // const { tripId } = useParams<{ tripId: string }>();

  // For a general admin page, tripId might be selected differently or not applicable
  // For now, let's assume a tripId is available, e.g., for a specific trip's admin section
  // If no tripId context here, ScheduledMessagesDashboard will need a way to select/filter trips
  const tripId = "some-mock-trip-id"; // Replace with actual tripId logic later

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Admin Dashboard: Scheduled Messages
        </h1>
        {tripId && <p className="text-muted-foreground">Managing messages for trip: {tripId}</p>}
      </header>

      <ScheduledMessagesDashboard tripId={tripId} />
      {/*
        If this were a global admin page without a specific trip context from URL:
        <ScheduledMessagesDashboard />
        The dashboard itself would then need a trip selector or show all messages
        with an option to filter by trip.
      */}
    </div>
  );
};

export default AdminScheduledMessagesPage;
