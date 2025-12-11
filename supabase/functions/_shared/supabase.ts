/**
 * Supabase Client für Edge Functions
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export function getSupabaseClient(authHeader?: string): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

export function getServiceClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  return createClient(supabaseUrl, serviceKey);
}
