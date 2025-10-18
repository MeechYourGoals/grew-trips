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
   * Build classic embeddable Google Maps URL (output=embed format)
   * This format works reliably in iframes without CSP/API key issues
   */
  static buildEmbeddableUrl(
    basecampAddress?: string,
    coords?: { lat: number; lng: number },
    destination?: string
  ): string {
    if (destination && basecampAddress) {
      // Directions from Base Camp to destination
      const s = encodeURIComponent(basecampAddress);
      const d = encodeURIComponent(destination);
      return `https://maps.google.com/maps?output=embed&saddr=${s}&daddr=${d}`;
    }
    
    if (basecampAddress) {
      // Show Base Camp location
      const q = encodeURIComponent(basecampAddress);
      return `https://maps.google.com/maps?output=embed&q=${q}`;
    }
    
    if (coords) {
      // Show specific coordinates
      return `https://maps.google.com/maps?output=embed&ll=${coords.lat},${coords.lng}&z=12`;
    }
    
    // Fallback: NYC default
    return `https://maps.google.com/maps?output=embed&ll=40.7580,-73.9855&z=12`;
  }

  // Fallback geocoding using OpenStreetMap Nominatim
  static async fallbackGeocodeNominatim(query: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { 
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Chravel/1.0'
        } 
      });
      
      if (!res.ok) return null;
      
      const arr = await res.json();
      if (Array.isArray(arr) && arr.length > 0 && arr[0].lat && arr[0].lon) {
        return { 
          lat: parseFloat(arr[0].lat), 
          lng: parseFloat(arr[0].lon),
          displayName: arr[0].display_name 
        };
      }
      return null;
    } catch (error) {
      console.error('Nominatim geocode error:', error);
      return null;
    }
  }

  // Fallback suggestions using OpenStreetMap Nominatim
  static async fallbackSuggestNominatim(query: string, limit = 8): Promise<any[]> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=${limit}&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { 
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Chravel/1.0'
        } 
      });
      
      if (!res.ok) return [];
      
      const arr = await res.json();
      if (!Array.isArray(arr)) return [];
      
      return arr.map((item: any) => ({
        source: 'osm',
        place_id: `osm:${item.place_id}`,
        description: item.display_name,
        osm_lat: parseFloat(item.lat),
        osm_lng: parseFloat(item.lon),
        types: ['geocode'],
        structured_formatting: {
          main_text: item.display_name.split(',')[0],
          secondary_text: item.display_name.split(',').slice(1).join(',').trim()
        }
      }));
    } catch (error) {
      console.error('Nominatim suggest error:', error);
      return [];
    }
  }

  // New: Text Search for natural language queries
  static async searchPlacesByText(query: string, location?: string): Promise<any> {
    try {
      return await this.callProxy('text-search', { 
        query,
        ...(location && { location })
      });
    } catch (error) {
      console.error('Text search error:', error);
      return { results: [], status: 'ZERO_RESULTS' };
    }
  }

  // New: Query type detection
  static detectQueryType(query: string): 'venue' | 'address' | 'region' {
    // Address pattern: number + street name
    if (/\d+\s+\w+\s+(st|street|ave|avenue|blvd|road|rd|drive|dr|lane|ln|way|court|ct)/i.test(query)) {
      return 'address';
    }
    
    // Region pattern: city/country keywords
    if (/(city|town|village|region|state|country|province)/i.test(query)) {
      return 'region';
    }
    
    // Venue pattern: no numbers, or has business keywords
    if (!/\d/.test(query) || /(restaurant|hotel|bar|cafe|club|lounge|stadium|arena|theater|museum|scandallo|scandalo)/i.test(query)) {
      return 'venue';
    }
    
    // Default: venue (most common for basecamp use case)
    return 'venue';
  }
}