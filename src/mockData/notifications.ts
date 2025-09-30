export const mockNotifications = [
  {
    id: 'mock-notif-1',
    type: 'message' as const,
    title: 'New message in Spring Break Cancun',
    message: 'Sarah Chen: Super excited for this trip!',
    timestamp: new Date().toISOString(),
    read: false,
    tripId: '1'
  },
  {
    id: 'mock-notif-2',
    type: 'broadcast' as const,
    title: 'Broadcast in Spring Break Cancun',
    message: 'Marcus Johnson: Just booked my flight',
    timestamp: new Date().toISOString(),
    read: false,
    tripId: '1'
  }
];
