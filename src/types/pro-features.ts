
import { ProParticipant, ProTripParticipant } from './team';

export interface RoomAssignment {
  id: string;
  room: string;
  hotel: string;
  occupants: string[];
  checkIn: string;
  checkOut: string;
  roomType: 'single' | 'double' | 'suite' | 'connecting';
  specialRequests?: string[];
}

export interface Equipment {
  id: string;
  name: string;
  category: 'audio' | 'video' | 'lighting' | 'instruments' | 'sports' | 'general';
  quantity: number;
  location: string;
  status: 'packed' | 'in-transit' | 'delivered' | 'setup' | 'missing';
  assignedTo?: string;
  notes?: string;
  trackingNumber?: string;
}

export interface ProSchedule {
  id: string;
  type: 'load-in' | 'sound-check' | 'rehearsal' | 'show' | 'load-out' | 'travel' | 'meeting';
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
}

export interface PerDiemData {
  dailyRate: number;
  currency: string;
  startDate: string;
  endDate: string;
  participants: Array<{
    participantId: string;
    customRate?: number;
    advances: number;
    deductions: number;
    balance: number;
  }>;
}

export interface SettlementData {
  venue: string;
  date: string;
  guarantee: number;
  backendPercentage: number;
  grossRevenue: number;
  expenses: number;
  netRevenue: number;
  merchandiseRevenue: number;
  finalPayout: number;
  status: 'pending' | 'calculated' | 'paid';
}

export interface MedicalLog {
  id: string;
  participantId: string;
  date: string;
  type: 'injury' | 'illness' | 'checkup' | 'therapy' | 'medication';
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'monitoring';
  treatedBy?: string;
  followUpDate?: string;
  restricted: boolean;
}

export interface ComplianceRule {
  id: string;
  type: 'visa' | 'union' | 'NCAA' | 'insurance' | 'safety';
  title: string;
  description: string;
  deadline?: string;
  status: 'compliant' | 'warning' | 'violation';
  assignedTo?: string;
  documents: string[];
}

export interface MediaSlot {
  id: string;
  type: 'interview' | 'photo-shoot' | 'press-conference' | 'podcast';
  outlet: string;
  contactPerson: string;
  scheduledTime: string;
  duration: number;
  location: string;
  participants: string[];
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface SponsorActivation {
  id: string;
  sponsor: string;
  activation: string;
  deadline: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  deliverables: string[];
  notes?: string;
}

export interface ProTripData {
  id: string;
  title: string;
  description: string;
  location: string;
  dateRange: string;
  category: string;
  proTripCategory?: 'Sports & Athletics' | 'Music & Entertainment Tours' | 'Corporate & Business' | 'Education & Academic' | 'TV/Film Production' | 'Startup & Tech';
  tags: string[];
  participants: ProTripParticipant[];
  budget: {
    total: number;
    spent: number;
    categories: Array<{
      name: string;
      budgeted: number;
      spent: number;
    }>;
  };
  itinerary: Array<{
    date: string;
    events: Array<{
      time: string;
      title: string;
      location: string;
      type: string;
    }>;
  }>;
  roster: ProParticipant[];
  roomAssignments: RoomAssignment[];
  equipment: Equipment[];
  schedule: ProSchedule[];
  perDiem: PerDiemData;
  settlement: SettlementData[];
  medical: MedicalLog[];
  compliance: ComplianceRule[];
  media: MediaSlot[];
  sponsors: SponsorActivation[];
}
