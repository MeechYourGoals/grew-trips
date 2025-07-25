import { supabase } from '@/integrations/supabase/client';

export const InviteService = {
  async acceptInvite(token: string) {
    const { data, error } = await supabase.rpc('join_trip_via_invite', {
      invite_token_param: token,
    });
    if (error) throw error;
    return typeof data === 'string' ? JSON.parse(data) : data;
  },
};
