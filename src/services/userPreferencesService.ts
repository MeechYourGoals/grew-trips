import { supabase } from '@/integrations/supabase/client';

export interface AppPreferences {
  hide_sample_content?: boolean;
}

const DEFAULT_PREFERENCES: AppPreferences = { hide_sample_content: false };

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
      const { error } = await (supabase as any)
        .from('user_preferences')
        .upsert({ user_id: userId, preferences: updates }, { onConflict: 'user_id' });
      return !error;
    } catch (e) {
      return false;
    }
  }
};
