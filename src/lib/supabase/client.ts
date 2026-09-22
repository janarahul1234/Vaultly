// Supabase client that runs in the browser (Client Components).
// createBrowserClient is a singleton, so calling this on every render is safe.
import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
