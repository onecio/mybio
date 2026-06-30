import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/supabase";

export function createSupabasePublicClient() {
  const { url, publishableKey } = getSupabaseConfig();

  if (!url || !publishableKey) {
    return null;
  }

  return createClient<Database>(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
