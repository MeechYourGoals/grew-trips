import { supabase } from '@/integrations/supabase/client';

export class GoogleMapsService {
  private static async callProxy(endpoint: string, data: any) {
    const { data: result, error } = await supabase.functions.invoke('google-maps-proxy', {
      body: { endpoint, ...data },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (error) {
      console.error('Google Maps proxy error:', error);
      throw new Error(`Google Maps API error: ${error.message}`);
    }

    if (!result) {
      throw new Error('No response from Google Maps service');
    }

    return result;
  }

  static async getEmbedUrl(query: string): Promise<string> {
    const result = await this.callProxy('embed-url', { query });
    return result.embedUrl;
  }

  static async getDistanceMatrix(
    origins: string,
    destinations: string,
    mode: string = 'DRIVING'
  ): Promise<any> {
    return await this.callProxy('distance-matrix', {
      origins,
      destinations,
      mode
    });
  }

  static async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const result = await this.callProxy('geocode', { address });
      
      if (result.results && result.results.length > 0) {
        const location = result.results[0].geometry?.location;
        if (location && location.lat && location.lng) {
          return {
            lat: location.lat,
            lng: location.lng
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  static async getPlaceAutocomplete(input: string, types: string[] = ['establishment', 'geocode']): Promise<any> {
    try {
      return await this.callProxy('autocomplete', { 
        input,
        types: types.join('|')
      });
    } catch (error) {
      console.error('Autocomplete error:', error);
      return { predictions: [] };
    }
  }

  static async getPlaceDetailsById(placeId: string): Promise<any> {
    try {
      return await this.callProxy('place-details', { placeId });
    } catch (error) {
      console.error('Place details error:', error);
      return null;
    }
  }

  static async searchPlacesNearBasecamp(
    query: string,
    basecampCoords: { lat: number; lng: number },
    radius: number = 5000
  ): Promise<any> {
    return await this.callProxy('places-search', {
      query,
      location: `${basecampCoords.lat},${basecampCoords.lng}`,
      radius
    });
  }

  static async getPlaceDetails(placeId: string): Promise<any> {
    return await this.callProxy('place-details', { placeId });
  }

  /**
   * Generate native Google Maps embed URL with Base Camp context
   * This creates a clean native Maps interface without CSP issues
   */
  static generateNativeEmbedUrl(
    basecampAddress?: string,
    basecampCoords?: { lat: number; lng: number }
  ): string {
    if (basecampAddress && basecampCoords) {
      // Show Base Camp location in native Google Maps
      const query = encodeURIComponent(basecampAddress);
      return `https://www.google.com/maps/place/${query}/@${basecampCoords.lat},${basecampCoords.lng},15z`;
    }
    
    // Fallback: Show approximate location (NYC default)
    return `https://www.google.com/maps/@40.7580,-73.9855,12z`;
  }

  /**
   * Generate embed URL with origin pre-filled for directions
   * Uses Edge Function to inject API key securely
   */
  static async getEmbedUrlWithOrigin(originAddress: string): Promise<string> {
    const result = await this.callProxy('embed-with-origin', { origin: originAddress });
    return result.embedUrl;
  }
}