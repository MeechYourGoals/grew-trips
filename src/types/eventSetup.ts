// Event Setup & Configuration Types

export interface EventSetupData {
  // Basic information
  title?: string;
  description?: string;
  location?: string;
  dateRange?: string;
  category?: string;
  tags?: string[];
  
  // Setup details
  capacity?: number;
  registrationStatus?: 'open' | 'closed' | 'waitlist';
  attendanceExpected?: number;
  groupChatEnabled?: boolean;
  
  // Schedule
  schedule?: EventScheduleData;
  template?: IndustryTemplate;
  
  // Invitations
  invitations?: EventInvitation[];
  
  // Additional settings
  settings?: Record<string, unknown>;
}

export interface EventScheduleData {
  sessions?: EventSession[];
  tracks?: EventTrack[];
  speakers?: EventSpeaker[];
  template?: IndustryTemplate;
  schedule?: unknown[];
}

export interface EventSession {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  speaker?: string;
  track?: string;
  capacity?: number;
}

export interface EventTrack {
  id: string;
  name: string;
  color: string;
  location: string;
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar: string;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  features: string[];
  settings: Record<string, unknown>;
  category?: string;
}

export interface EventInvitation {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt?: string;
  respondedAt?: string;
  qrCode?: string;
}

export interface EventBasicsFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  dateRange: string;
  capacity: number;
  registrationStatus: 'open' | 'closed' | 'waitlist';
}

export interface EventSetupFormData {
  industry: string;
  eventType: string;
  size: string;
  duration: string;
  features: string[];
}

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface EmergencyBroadcastData {
  message: string;
  urgency: UrgencyLevel;
  targetAudience: string[];
  requiresAcknowledgment: boolean;
}
