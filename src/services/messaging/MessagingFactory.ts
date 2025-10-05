import { IMessagingProvider } from "./IMessagingProvider";
import { SupabaseMessagingProvider } from "./SupabaseMessagingProvider";
import { StreamMessagingProvider } from "./StreamMessagingProvider";

export type MessagingProviderType = 'supabase' | 'stream';

export class MessagingFactory {
  private static providers: Map<string, IMessagingProvider> = new Map();

  /**
   * Get or create a messaging provider for a specific trip
   * Consumer trips use Supabase, Pro trips use Stream
   */
  static getProvider(tripId: string, tripType: 'consumer' | 'pro' | 'event'): IMessagingProvider {
    const cacheKey = `${tripId}-${tripType}`;
    
    if (this.providers.has(cacheKey)) {
      return this.providers.get(cacheKey)!;
    }

    // Consumer trips use Supabase, Pro/Event trips use Stream
    const providerType: MessagingProviderType = tripType === 'consumer' ? 'supabase' : 'stream';
    const provider = this.createProvider(providerType);
    
    this.providers.set(cacheKey, provider);
    return provider;
  }

  /**
   * Create a new provider instance
   */
  static createProvider(type: MessagingProviderType): IMessagingProvider {
    switch (type) {
      case 'supabase':
        return new SupabaseMessagingProvider();
      case 'stream':
        return new StreamMessagingProvider();
      default:
        throw new Error(`Unknown messaging provider type: ${type}`);
    }
  }

  /**
   * Clean up a specific provider
   */
  static async releaseProvider(tripId: string, tripType: string): Promise<void> {
    const cacheKey = `${tripId}-${tripType}`;
    const provider = this.providers.get(cacheKey);
    
    if (provider) {
      await provider.disconnect();
      this.providers.delete(cacheKey);
    }
  }

  /**
   * Clean up all providers
   */
  static async releaseAll(): Promise<void> {
    const promises = Array.from(this.providers.values()).map(p => p.disconnect());
    await Promise.all(promises);
    this.providers.clear();
  }
}
