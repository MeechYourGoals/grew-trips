
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'artist' | 'manager' | 'assistant' | 'crew' | 'security' | 'photographer' | 'videographer' | 'label-rep' | 'venue-rep';
  permissions: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  organizationId?: string;
  seatId?: string;
}

export interface ProParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  credentialLevel: 'AllAccess' | 'Backstage' | 'Guest' | 'Restricted';
  permissions: string[];
  roomPreferences?: string[];
  dietaryRestrictions?: string[];
  medicalNotes?: string;
}

export interface ProTripParticipant {
  id: number;
  name: string;
  email?: string;
  avatar: string;
  role: string;
}
