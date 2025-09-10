import { createBrowserClient } from '@supabase/ssr';
import { config } from '@/lib/env';

export function createClient() {
  return createBrowserClient(
    config.supabase.url,
    config.supabase.anonKey
  );
}
