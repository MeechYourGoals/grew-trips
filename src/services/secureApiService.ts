import { supabase } from '@/integrations/supabase/client';

export class SecureApiService {
  static async callMapsApi(action: string, params: any) {
    try {
      const { data, error } = await supabase.functions.invoke('secure-maps-api', {
        body: {
          action,
          ...params
        }
      });

      if (error) {
        console.error('Secure Maps API Error:', error);
        throw new Error('Maps service unavailable');
      }

      return data;
    } catch (error) {
      console.error('Maps API call failed:', error);
      throw error;
    }
  }

  static async getDistanceMatrix(origins: string, destinations: string, mode: string = 'driving') {
    return this.callMapsApi('distance_matrix', { origins, destinations, mode });
  }

  static async geocodeAddress(address: string) {
    return this.callMapsApi('geocode', { address });
  }

  static async getSecureEmbedUrl(query: string, zoom: number = 12) {
    return this.callMapsApi('embed_url', { query, zoom });
  }
}