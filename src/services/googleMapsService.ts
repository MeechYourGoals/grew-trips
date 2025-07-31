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

  static async geocodeAddress(address: string): Promise<any> {
    return await this.callProxy('geocode', { address });
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
}