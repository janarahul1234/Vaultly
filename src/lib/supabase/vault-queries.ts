// Server-side reads for the vault. Called from the dashboard Server Component
// so secrets never round-trip through a client fetch and the initial paint has
// data without a loading waterfall. RLS scopes every query to the current
// user; the explicit `user_id`/`deleted_at` predicates exist to use the
// (user_id, deleted_at) composite index.
import { rowsToVaultItems } from "@/lib/vault-mapper";
import { createClient } from "@/lib/supabase/server";

import type { VaultItem, VaultItemRow } from "@/types/password";

export type VaultData = {
  items: VaultItem[];
  trash: VaultItem[];
};

/** Active (non-trashed) items A→Z and trashed items most-recently-deleted. */
export async function getVaultData(): Promise<VaultData> {
  const supabase = await createClient();

  const [active, trashed] = await Promise.all([
    supabase
      .from("vault_items")
      .select("*")
      .is("deleted_at", null)
      .order("name", { ascending: true }),
    supabase
      .from("vault_items")
      .select("*")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
  ]);

  // During the provisioning window (table not created yet) we degrade to the
  // empty state rather than crashing the route; mutations surface their own
  // errors via toasts.
  if (active.error) console.error("getVaultData(active)", active.error.message);
  if (trashed.error) console.error("getVaultData(trash)", trashed.error.message);

  return {
    items: rowsToVaultItems((active.data ?? []) as VaultItemRow[]),
    trash: rowsToVaultItems((trashed.data ?? []) as VaultItemRow[]),
  };
}
