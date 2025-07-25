import { supabase } from '../integrations/supabase/client';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'business' | 'first';
}

export interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  price: number;
  currency: string;
  duration: string;
  stops: number;
  bookingUrl: string;
}

export interface HotelSearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  priceRange?: [number, number];
}

export interface HotelResult {
  id: string;
  name: string;
  address: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  photos: string[];
  bookingUrl: string;
  availability: boolean;
}

export interface RestaurantSearchParams {
  location: string;
  date: string;
  time: string;
  partySize: number;
  cuisine?: string;
}

export interface RestaurantResult {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceLevel: number;
  cuisine: string;
  photos: string[];
  availability: boolean;
  reservationUrl: string;
}

export interface TransportationSearchParams {
  pickup: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  type: 'uber' | 'lyft' | 'taxi' | 'rental';
}

export interface TransportationResult {
  id: string;
  provider: string;
  type: string;
  estimatedPrice: number;
  estimatedTime: string;
  vehicleType: string;
  bookingUrl: string;
}

export class TravelBookingService {
  private apiEndpoints = {
    flights: '/api/flights',
    hotels: '/api/hotels',
    restaurants: '/api/restaurants',
    transportation: '/api/transportation'
  };

  async searchFlights(params: FlightSearchParams): Promise<FlightResult[]> {
    try {
      const apiKey = (import.meta as any).env.VITE_SKYSCANNER_API_KEY as string | undefined;
      if (!apiKey) {
        console.warn('Skyscanner API key not configured');
        return [];
      }

      const query = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        departDate: params.departDate,
        adults: params.passengers.toString(),
        cabinClass: params.class
      });
      if (params.returnDate) query.set('returnDate', params.returnDate);

      const res = await fetch(
        `https://partners.api.skyscanner.net/apiservices/v3/flights/search?${query.toString()}`,
        { headers: { apikey: apiKey } }
      );
      const data = await res.json();

      return (data.flights || []).map((f: any) => ({
        id: f.id,
        airline: f.airline || f.carrier,
        flightNumber: f.flightNumber || f.number,
        departure: {
          airport: f.departureAirport,
          time: f.departureTime,
          date: f.departureDate
        },
        arrival: {
          airport: f.arrivalAirport,
          time: f.arrivalTime,
          date: f.arrivalDate
        },
        price: f.price?.amount || 0,
        currency: f.price?.currency || 'USD',
        duration: f.duration,
        stops: f.stops || 0,
        bookingUrl: f.bookingUrl
      }));
    } catch (error) {
      console.error('Flight search failed:', error);
      return [];
    }
  }

  async searchHotels(params: HotelSearchParams): Promise<HotelResult[]> {
    try {
      const apiKey = (import.meta as any).env.VITE_BOOKING_API_KEY as string | undefined;
      if (!apiKey) {
        console.warn('Booking.com API key not configured');
        return [];
      }

      const query = new URLSearchParams({
        location: params.location,
        checkin_date: params.checkIn,
        checkout_date: params.checkOut,
        adults_number: params.guests.toString(),
        room_number: params.rooms.toString()
      });

      const res = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/search?${query.toString()}`,
        {
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
          }
        });
      const data = await res.json();

      return (data.result || []).map((h: any) => ({
        id: String(h.hotel_id),
        name: h.hotel_name,
        address: h.address || h.address_trans,
        rating: h.review_score,
        pricePerNight: h.min_total_price,
        currency: h.currency_code,
        amenities: h.hotel_amenities || [],
        photos: h.main_photo_url ? [h.main_photo_url] : [],
        bookingUrl: h.url,
        availability: (h.available_rooms ?? 1) > 0
      }));
    } catch (error) {
      console.error('Hotel search failed:', error);
      return [];
    }
  }

  async searchRestaurants(params: RestaurantSearchParams): Promise<RestaurantResult[]> {
    try {
      const apiKey = (import.meta as any).env.VITE_YELP_API_KEY as string | undefined;
      if (!apiKey) {
        console.warn('Yelp API key not configured');
        return [];
      }

      const query = new URLSearchParams({
        location: params.location,
        term: params.cuisine ?? 'restaurants'
      });

      const res = await fetch(`https://api.yelp.com/v3/businesses/search?${query.toString()}`,
        { headers: { Authorization: `Bearer ${apiKey}` } });
      const data = await res.json();

      return (data.businesses || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        address: r.location?.display_address?.join(', ') || '',
        rating: r.rating,
        priceLevel: r.price ? r.price.length : 0,
        cuisine: r.categories?.[0]?.title ?? '',
        photos: r.image_url ? [r.image_url] : [],
        availability: true,
        reservationUrl: r.url
      }));
    } catch (error) {
      console.error('Restaurant search failed:', error);
      return [];
    }
  }

  async searchTransportation(params: TransportationSearchParams): Promise<TransportationResult[]> {
    try {
      const apiKey = (import.meta as any).env.VITE_UBER_API_KEY as string | undefined;
      if (!apiKey) {
        console.warn('Uber API key not configured');
        return [];
      }

      const query = new URLSearchParams({
        start_address: params.pickup,
        end_address: params.destination
      });

      const res = await fetch(`https://api.uber.com/v1.2/estimates/price?${query.toString()}`,
        { headers: { Authorization: `Bearer ${apiKey}` } });
      const data = await res.json();

      return (data.prices || []).map((t: any) => ({
        id: t.product_id,
        provider: 'Uber',
        type: t.display_name,
        estimatedPrice: t.low_estimate || 0,
        estimatedTime: `${Math.round((t.duration || 0) / 60)} min`,
        vehicleType: t.display_name,
        bookingUrl: 'https://m.uber.com'
      }));
    } catch (error) {
      console.error('Transportation search failed:', error);
      return [];
    }
  }

  // Utility methods for booking management
  async saveBooking(type: 'flight' | 'hotel' | 'restaurant' | 'transportation', booking: any, tripId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('trip_bookings')
        .insert({
          trip_id: tripId,
          user_id: user.id,
          booking_type: type,
          provider: booking.provider || booking.airline || booking.name,
          external_booking_id: booking.id,
          booking_data: booking,
          total_price: booking.price || booking.pricePerNight || booking.estimatedPrice,
          currency: booking.currency || 'USD',
          travel_date: booking.departure?.date || booking.checkIn || booking.date || null
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, bookingId: data.id };
    } catch (error) {
      console.error('Failed to save booking:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getBookingStatus(bookingId: string) {
    try {
      // This would check booking status with the provider
      return {
        id: bookingId,
        status: 'confirmed',
        confirmationNumber: 'ABC123',
        provider: 'United Airlines'
      };
    } catch (error) {
      console.error('Failed to get booking status:', error);
      return null;
    }
  }

  async cancelBooking(bookingId: string) {
    try {
      // This would cancel the booking with the provider
      return { success: true, refundAmount: 299 };
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Price comparison across multiple providers
  async comparePrices(type: 'flight' | 'hotel', params: any) {
    try {
      // This would query multiple providers and return aggregated results
      const results = await Promise.all([
        this.searchFlights(params),
        // Add more providers here
      ]);

      return results.flat().sort((a, b) => a.price - b.price);
    } catch (error) {
      console.error('Price comparison failed:', error);
      return [];
    }
  }
}

export const travelBookingService = new TravelBookingService();