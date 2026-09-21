"use server";

// Vault CRUD as Server Actions (the Next.js-preferred mutation path). Each
// action authenticates, writes to Supabase under RLS, revalidates the dashboard
// segment, and returns the authoritative row so the client hook can reconcile
// its optimistic-free state without a follow-up read. RLS is still the real
// security boundary; the getClaims() check is defense in depth and lets us
// return a clean message instead of a Postgres error.

import { revalidatePath } from "next/cache";

import { rowToVaultItem } from "@/lib/vault-mapper";
import { createClient } from "@/lib/supabase/server";

import type {
  ItemDraft,
  ItemEditDraft,
  VaultItemResult,
  VaultItemRow,
  VaultResult,
} from "@/types/password";

const GENERIC_ERROR = "Something went wrong. Please try again.";

/** Returns the signed-in user's id, or null when the session is missing/invalid. */
async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const sub = data?.claims?.sub;
  return typeof sub === "string" ? sub : null;
}

function toSingle(value: unknown): VaultItemRow | null {
  return (value as VaultItemRow | null) ?? null;
}

/** Create a new vault item for the current user. */
export async function createVaultItem(draft: ItemDraft): Promise<VaultItemResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, message: "You must be signed in." };

  const name = draft.name?.trim();
  if (!name) return { ok: false, message: "Title is required." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vault_items")
    .insert({
      user_id: userId,
      type: draft.type,
      name,
      website: draft.website?.trim() || null,
      username: draft.username?.trim() || null,
      category: draft.category ?? "Personal",
      tags: draft.tags ?? [],
      favorite: false,
      password: draft.type === "login" ? draft.password || null : null,
      notes: draft.notes?.trim() || null,
      icon_key: "generic",
    })
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, message: error?.message ?? GENERIC_ERROR };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(data as VaultItemRow) };
}

/** Update an existing item's editable fields. */
export async function updateVaultItem(
  id: string,
  draft: ItemEditDraft,
): Promise<VaultItemResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, message: "You must be signed in." };

  const name = draft.name?.trim();
  if (!name) return { ok: false, message: "Title is required." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vault_items")
    .update({
      type: draft.type,
      name,
      website: draft.website?.trim() || null,
      username: draft.username?.trim() || null,
      category: draft.category,
      tags: draft.tags ?? [],
      password: draft.type === "login" ? draft.password || null : null,
      notes: draft.notes?.trim() || null,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, message: error?.message ?? "Could not update the item." };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(data as VaultItemRow) };
}

/** Flip the favorite flag and return the updated item. */
export async function toggleVaultItemFavorite(id: string): Promise<VaultItemResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, message: "You must be signed in." };

  const supabase = await createClient();
  const { data: current, error: readError } = await supabase
    .from("vault_items")
    .select("favorite")
    .eq("id", id)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .single();

  if (readError || !current) {
    return { ok: false, message: "Item not found." };
  }

  const { data, error } = await supabase
    .from("vault_items")
    .update({ favorite: !current.favorite })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, message: error?.message ?? "Could not update the item." };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(toSingle(data)!) };
}

/** Soft-delete: move an active item into the trash. */
export async function trashVaultItem(id: string): Promise<VaultItemResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, message: "You must be signed in." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vault_items")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, message: error?.message ?? "Could not move the item to trash." };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(toSingle(data)!) };
}

/** Restore a trashed item back into the active vault. */
export async function restoreVaultItem(id: string): Promise<VaultItemResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, message: "You must be signed in." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vault_items")
    .update({ deleted_at: null })
    .eq("id", id)
    .eq("user_id", userId)
    .not("deleted_at", "is", null)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, message: error?.message ?? "Could not restore the item." };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(toSingle(data)!) };
}

/** Permanently delete a trashed item. */
export async function deleteVaultItemForever(id: string): Promise<VaultResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, message: "You must be signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("vault_items")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .not("deleted_at", "is", null);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

/** Remove a single tag from an item and return the updated row. */
export async function removeVaultItemTag(
  id: string,
  tag: string,
): Promise<VaultItemResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, message: "You must be signed in." };

  const supabase = await createClient();
  const { data: current, error: readError } = await supabase
    .from("vault_items")
    .select("tags")
    .eq("id", id)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .single();

  if (readError || !current) {
    return { ok: false, message: "Item not found." };
  }

  const nextTags = ((current.tags ?? []) as string[]).filter((t) => t !== tag);

  const { data, error } = await supabase
    .from("vault_items")
    .update({ tags: nextTags })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, message: error?.message ?? "Could not update the item." };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(toSingle(data)!) };
}
