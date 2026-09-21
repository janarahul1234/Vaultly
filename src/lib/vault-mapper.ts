// Server-safe mapping between the Postgres `vault_items` rows and the
// client-facing VaultItem model. Kept free of any browser/`toast` imports so
// it can be used from Server Components, Server Actions, and the client hook
// alike (the pure helpers in @/lib/vault-helpers pull in client-only code and
// must not be imported on the server).
//
// The VaultItem model carries two derived views of `updated_at`:
//   * `updatedAt`     — whole days since the update, used for sorting.
//   * `updatedLabel`  — a human relative string ("2 days ago").
// plus absolute `createdAt` / `updatedAtLabel` strings for the details footer.

import { format } from "date-fns";

import type { VaultItem, VaultItemRow } from "@/types/password";

const MS_PER_DAY = 86_400_000;

/** Absolute "Jan 10, 2024, 3:24 PM" format used in the details panel footer. */
function absoluteLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "MMM d, yyyy, h:mm a");
}

/** Whole days elapsed since `iso` (0 = today) — the sort key. */
function daysSince(iso: string, now: number): number {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return 0;
  return Math.max(0, Math.floor((now - time) / MS_PER_DAY));
}

/**
 * Relative label matching the existing copy vocabulary
 * ("Just now" → minutes → hours → days → weeks → months).
 */
function relativeLabel(iso: string, now: number): string {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";
  const seconds = Math.max(0, Math.floor((now - time) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

/** Maps a single DB row into the VaultItem shape the dashboard renders. */
export function rowToVaultItem(row: VaultItemRow, now = Date.now()): VaultItem {
  return {
    id: row.id,
    name: row.name,
    username: row.username ?? "",
    website: row.website ?? "",
    category: row.category,
    tags: row.tags ?? [],
    type: row.type,
    favorite: row.favorite,
    updatedAt: daysSince(row.updated_at, now),
    updatedLabel: relativeLabel(row.updated_at, now),
    iconKey: row.icon_key,
    password: row.password ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: absoluteLabel(row.created_at),
    updatedAtLabel: absoluteLabel(row.updated_at),
  };
}

/** Maps a list of rows, hoisting the shared `now` so labels stay consistent. */
export function rowsToVaultItems(rows: VaultItemRow[]): VaultItem[] {
  const now = Date.now();
  return rows.map((row) => rowToVaultItem(row, now));
}
