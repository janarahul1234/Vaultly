// Server-side reads for the vault. Called from the dashboard Server Component
// so secrets never round-trip through a client fetch and the initial paint has
// data without a loading waterfall. RLS scopes every query to the current
// user; the explicit `deleted_at` predicates drive the (user_id, deleted_at)
// composite index. `server-only` keeps this module out of the client bundle —
// the shared VaultData shape lives in @/types/password instead.
import "server-only";

import { rowsToVaultItems, VAULT_ITEM_SELECT } from "@/lib/vault-mapper";
import { createClient } from "@/lib/supabase/server";

import type { VaultData, VaultItemRow } from "@/types/password";

/** Active (non-trashed) items A→Z and trashed items most-recently-deleted. */
export async function getVaultData(): Promise<VaultData> {
  const supabase = await createClient();

  // Independent reads run in parallel to avoid a waterfall (rule #20).
  const [active, trashed] = await Promise.all([
    supabase
      .from("vault_items")
      .select(VAULT_ITEM_SELECT)
      .is("deleted_at", null)
      .order("name", { ascending: true }),
    supabase
      .from("vault_items")
      .select(VAULT_ITEM_SELECT)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
  ]);

  // During the provisioning window (table not created yet) we degrade to the
  // empty state rather than crashing the route; details are logged server-side
  // only and mutations surface their own errors via toasts.
  if (active.error) console.error("getVaultData(active)", active.error.message);
  if (trashed.error) console.error("getVaultData(trash)", trashed.error.message);

  return {
    items: rowsToVaultItems((active.data ?? []) as VaultItemRow[]),
    trash: rowsToVaultItems((trashed.data ?? []) as VaultItemRow[]),
  };
}
