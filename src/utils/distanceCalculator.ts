
import { BasecampLocation, PlaceWithDistance, DistanceCalculationSettings } from '../types/basecamp';
import { SecureApiService } from '../services/secureApiService';

export class DistanceCalculator {
  private static cache = new Map<string, any>();

  static async calculateDistance(
    basecamp: BasecampLocation,
    place: PlaceWithDistance,
    settings: DistanceCalculationSettings
  ): Promise<number | null> {
    if (!place.coordinates && !place.address) {
      console.warn('Place has no coordinates or address');
      return null;
    }

    const cacheKey = `${basecamp.coordinates.lat},${basecamp.coordinates.lng}-${place.coordinates?.lat || place.address}-${settings.preferredMode}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let distance: number | null = null;

      if (settings.preferredMode === 'straightLine') {
        distance = this.calculateStraightLineDistance(basecamp.coordinates, place.coordinates);
      } else {
        distance = await this.calculateRouteDistance(basecamp, place, settings.preferredMode);
      }

      if (distance !== null) {
        // Convert to preferred unit
        if (settings.unit === 'km' && distance) {
          distance = distance * 1.60934; // miles to km
        }
        
        this.cache.set(cacheKey, distance);
      }

      return distance;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return null;
    }
  }

  private static calculateStraightLineDistance(
    coord1: { lat: number; lng: number },
    coord2?: { lat: number; lng: number }
  ): number | null {
    if (!coord2) return null;

    const R = 3959; // Earth's radius in miles
    const dLat = this.deg2rad(coord2.lat - coord1.lat);
    const dLng = this.deg2rad(coord2.lng - coord1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(coord1.lat)) * Math.cos(this.deg2rad(coord2.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  private static async calculateRouteDistance(
    basecamp: BasecampLocation,
    place: PlaceWithDistance,
    mode: 'driving' | 'walking'
  ): Promise<number | null> {
    const origin = `${basecamp.coordinates.lat},${basecamp.coordinates.lng}`;
    const destination = place.coordinates 
      ? `${place.coordinates.lat},${place.coordinates.lng}`
      : place.address || '';

    try {
      const response = await SecureApiService.getDistanceMatrix(origin, destination, mode.toLowerCase());
      
      if (response.success && response.data.status === 'OK' && response.data.rows[0]?.elements[0]?.status === 'OK') {
        const distanceText = response.data.rows[0].elements[0].distance.text;
        const distanceValue = parseFloat(distanceText.replace(/[^\d.]/g, ''));
        return distanceValue;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching distance from secure API:', error);
      return null;
    }
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  static async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await SecureApiService.geocodeAddress(address);
      
      if (response.success && response.data.status === 'OK' && response.data.results[0]) {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }
}
