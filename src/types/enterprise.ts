
export type TripCategory =
  | "sports-pro" | "sports-college" | "sports-hs" | "sports-aau"
  | "tour-music" | "tour-comedy" | "tour-other"
  | "influencer" | "retreat" | "recruit" | "biz" | "field" | "film" | "nonprofit";

export interface EnterpriseSettingsState {
  tripCategory: TripCategory;
  organizationId: string;
  userId: string;
}

export interface GameScheduleItem {
  id: string;
  opponent: string;
  venue: string;
  venueAddress: string;
  gameDate: string;
  gameTime: string;
  loadInTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  isHome: boolean;
}

export interface ShowScheduleItem {
  id: string;
  title: string;
  venue: string;
  venueAddress: string;
  showDate: string;
  showTime: string;
  soundCheckTime: string;
  loadInTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'audio' | 'video' | 'lighting' | 'instruments' | 'sports' | 'general';
  quantity: number;
  insuredValue: number;
  status: 'packed' | 'in-transit' | 'delivered' | 'setup' | 'missing';
  trackingNumber?: string;
  assignedTo?: string;
}

export interface CredentialZone {
  id: string;
  name: string;
  description: string;
  accessLevel: 'public' | 'restricted' | 'vip' | 'staff-only';
}

export interface SettlementData {
  guaranteeFee: number;
  backendPercentage: number;
  merchandiseRevenue: number;
  ticketRevenue: number;
  expenses: number;
  finalPayout: number;
}

export interface SponsorDeliverable {
  id: string;
  sponsorName: string;
  deliverable: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string;
}

export interface ComplianceRule {
  id: string;
  category: 'NCAA' | 'Union' | 'Safety' | 'Legal' | 'Insurance';
  title: string;
  description: string;
  deadline?: string;
  status: 'compliant' | 'warning' | 'violation';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ScoutingProspect {
  id: string;
  name: string;
  position: string;
  school: string;
  grade: string;
  contactInfo: string;
  notes: string;
  rating: number;
}

export interface WellnessEntry {
  id: string;
  participantId: string;
  date: string;
  type: 'injury' | 'illness' | 'treatment' | 'checkup';
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
  status: 'active' | 'resolved';
  private: boolean;
}
