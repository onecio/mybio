import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/supabase";

export function createSupabaseBrowserClient() {
  const { url, publishableKey } = getSupabaseConfig();

  if (!url || !publishableKey) {
    return null;
  }

  return createBrowserClient<Database>(url, publishableKey);
}
