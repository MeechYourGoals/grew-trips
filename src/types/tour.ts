
import { TeamMember } from './team';

export interface Tour {
  id: string;
  name: string;
  description?: string;
  artistName: string;
  startDate: string;
  endDate: string;
  trips: TourTrip[];
  teamMembers: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TourTrip {
  id: string;
  tourId: string;
  city: string;
  venue: string;
  venueAddress: string;
  date: string;
  category: 'headline' | 'private' | 'college' | 'festival' | 'corporate';
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
  participants: TeamMember[];
  notes?: string;
  accommodation?: {
    type: 'hotel' | 'airbnb' | 'other';
    name: string;
    address: string;
    confirmationNumber: string;
    checkIn: string;
    checkOut: string;
    isPrivate?: boolean;
    allowedRoles?: string[];
  };
  transportation?: {
    type: 'flight' | 'train' | 'bus' | 'car' | 'other';
    details: string;
    confirmationNumber: string;
    dateTime: string;
    isPrivate?: boolean;
    allowedRoles?: string[];
  };
}
