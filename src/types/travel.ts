
export interface TravelWallet {
  id: string;
  userId: string;
  airlinePrograms: AirlineProgram[];
  hotelPrograms: HotelProgram[];
  rentalCarPrograms: RentalCarProgram[];
  createdAt: string;
  updatedAt: string;
}

export interface AirlineProgram {
  id: string;
  airline: string;
  programName: string;
  membershipNumber: string;
  tier?: string;
  isPreferred: boolean;
}

export interface HotelProgram {
  id: string;
  hotelChain: string;
  programName: string;
  membershipNumber: string;
  tier?: string;
  isPreferred: boolean;
}

export interface RentalCarProgram {
  id: string;
  company: string;
  programName: string;
  membershipNumber: string;
  tier?: string;
  isPreferred: boolean;
}
