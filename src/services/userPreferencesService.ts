import { supabase } from '@/integrations/supabase/client';
import { TripPreferences } from '@/types/consumer';

export interface AppPreferences {
  hide_sample_content?: boolean;
  ai_concierge_preferences?: TripPreferences;
}

const DEFAULT_PREFERENCES: AppPreferences = { 
  hide_sample_content: false,
  ai_concierge_preferences: {
    dietary: [],
    vibe: [],
    accessibility: [],
    business: [],
    entertainment: [],
    lifestyle: [],
    budgetMin: 0,
    budgetMax: 1000,
    timePreference: 'flexible'
  }
};

export const userPreferencesService = {
  async get(userId: string): Promise<AppPreferences> {
    try {
      const { data, error } = await (supabase as any)
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) return DEFAULT_PREFERENCES;
      return { ...DEFAULT_PREFERENCES, ...(data?.preferences || {}) } as AppPreferences;
    } catch (e) {
      return DEFAULT_PREFERENCES;
    }
  },

  async set(userId: string, updates: Partial<AppPreferences>): Promise<boolean> {
    try {
      const current = await this.get(userId);
      const merged = { ...current, ...updates };
      
      const { error } = await (supabase as any)
        .from('user_preferences')
        .upsert({ user_id: userId, preferences: merged }, { onConflict: 'user_id' });
      return !error;
    } catch (e) {
      return false;
    }
  },

  async getAIPreferences(userId: string): Promise<TripPreferences> {
    const prefs = await this.get(userId);
    return prefs.ai_concierge_preferences || DEFAULT_PREFERENCES.ai_concierge_preferences!;
  },

  async setAIPreferences(userId: string, aiPrefs: TripPreferences): Promise<boolean> {
    return this.set(userId, { ai_concierge_preferences: aiPrefs });
  }
};
