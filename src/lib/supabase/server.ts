// Supabase client for Server Components, Server Actions, and Route Handlers.
// A fresh client is created per request because it reads the request cookies.
// `server-only` makes an accidental import from Client Components a build
// error instead of a silent secret leak.
import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Components can't write cookies; the Proxy keeps the session
          // fresh, so ignore the error here and let it propagate normally in
          // Route Handlers / Server Actions where writes are allowed.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore.
          }
        },
      },
    },
  );
}
