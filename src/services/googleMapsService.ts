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

  static generateDirectionsEmbedUrl(origin: string, destination: string): string {
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDestination = encodeURIComponent(destination);
    return `https://www.google.com/maps/embed/v1/directions?origin=${encodedOrigin}&destination=${encodedDestination}&mode=driving`;
  }

  static generateDirectionsEmbedUrlWithCoords(
    originCoords: { lat: number; lng: number },
    destination: string
  ): string {
    const encodedDestination = encodeURIComponent(destination);
    return `https://www.google.com/maps/embed/v1/directions?origin=${originCoords.lat},${originCoords.lng}&destination=${encodedDestination}&mode=driving`;
  }

  /**
   * Search with origin context - generates both embed and directions URLs
   */
  static searchWithOrigin(
    destinationQuery: string,
    originCoords: { lat: number; lng: number },
    originAddress: string
  ): { embedUrl: string; directionsUrl: string } {
    const encodedOrigin = encodeURIComponent(originAddress);
    const encodedDestination = encodeURIComponent(destinationQuery);
    
    // For iframe embed (directions mode) - no API key in URL params, handled by proxy
    const embedUrl = this.generateDirectionsEmbedUrlWithCoords(originCoords, destinationQuery);
    
    // For external link (opens in new tab)
    const directionsUrl = `https://www.google.com/maps/dir/${encodedOrigin}/${encodedDestination}`;
    
    return { embedUrl, directionsUrl };
  }

  /**
   * Generate search URL with location bias near Base Camp
   */
  static searchPlacesWithLocationBias(
    query: string,
    originCoords: { lat: number; lng: number }
  ): string {
    // Use search endpoint with center parameter for proximity bias
    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/maps?q=${encodedQuery}&center=${originCoords.lat},${originCoords.lng}&zoom=14&output=embed`;
  }
}