// Validated public environment (rule #16). Parsing at module load means a
// missing/typo'd Supabase variable fails fast at boot with a clear error
// instead of surfacing as a cryptic client failure at request time.
// Only NEXT_PUBLIC_* values belong here — private secrets must never be
// re-exported through this module (rule #4).
import { z } from "zod";

const PublicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({
    error: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL.",
  }),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, {
    error: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set.",
  }),
});

export const env = PublicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});
