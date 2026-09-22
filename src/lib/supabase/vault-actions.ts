"use server";

// Vault CRUD as Server Actions (the Next.js-preferred mutation path).
// Every action follows the same order (rule #12):
//   validate input (Zod safeParse on untrusted args)
//     → authenticate (getClaims)
//     → Supabase write, scoped by RLS + explicit user_id predicates
//     → revalidatePath("/dashboard")
//     → return the authoritative row (or a user-safe error).
// Postgres/Supabase error details are logged server-side only — clients get
// generic messages so schema internals never leak (rule #55).

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import {
  VaultItemDraftInputSchema,
  VaultItemEditInputSchema,
  VaultItemIdSchema,
  VaultItemTagSchema,
  firstIssueMessage,
} from "@/lib/schemas/vault-item";
import { rowToVaultItem, VAULT_ITEM_SELECT } from "@/lib/vault-mapper";
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

const UNAUTHORIZED_MESSAGE = "You must be signed in.";

const UNAUTHORIZED: VaultItemResult = {
  ok: false,
  message: UNAUTHORIZED_MESSAGE,
};

/**
 * Logs the real error server-side and hands back a user-safe result. An
 * empty result set (`.maybeSingle()` → null) means the row doesn't exist or
 * isn't ours — RLS already hides foreign rows, so both cases read as "not
 * found" without leaking existence.
 */
function actionFailure(
  action: string,
  detail: unknown,
  message = GENERIC_ERROR,
): VaultItemResult {
  console.error(`[vault-actions] ${action}`, detail);
  return { ok: false, message };
}

function validationFailure(action: string, error: ZodError): VaultItemResult {
  console.error(`[vault-actions] ${action} validation`, error.issues[0]?.message);
  return { ok: false, message: firstIssueMessage(error) };
}

/** Create a new vault item for the current user. */
export async function createVaultItem(
  draft: ItemDraft,
): Promise<VaultItemResult> {
  const parsed = VaultItemDraftInputSchema.safeParse(draft);
  if (!parsed.success) return validationFailure("createVaultItem", parsed.error);

  const userId = await requireUserId();
  if (!userId) return UNAUTHORIZED;

  const input = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vault_items")
    .insert({
      user_id: userId,
      type: input.type,
      name: input.name,
      website: input.website || null,
      username: input.username || null,
      category: input.category,
      tags: input.tags,
      favorite: false,
      password: input.type === "login" ? input.password : null,
      notes: input.notes || null,
      icon_key: "generic",
    })
    .select(VAULT_ITEM_SELECT)
    .single();

  if (error || !data) {
    return actionFailure("createVaultItem", error, "Unable to save the item.");
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(data as VaultItemRow) };
}

/** Update an existing item's editable fields. */
export async function updateVaultItem(
  id: string,
  draft: ItemEditDraft,
): Promise<VaultItemResult> {
  const parsedId = VaultItemIdSchema.safeParse(id);
  if (!parsedId.success) return validationFailure("updateVaultItem", parsedId.error);

  const parsed = VaultItemEditInputSchema.safeParse(draft);
  if (!parsed.success) return validationFailure("updateVaultItem", parsed.error);

  const userId = await requireUserId();
  if (!userId) return UNAUTHORIZED;

  const input = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vault_items")
    .update({
      type: input.type,
      name: input.name,
      website: input.website || null,
      username: input.username || null,
      category: input.category,
      tags: input.tags,
      password: input.type === "login" ? input.password : null,
      notes: input.notes || null,
    })
    .eq("id", parsedId.data)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select(VAULT_ITEM_SELECT)
    .maybeSingle();

  if (error) {
    return actionFailure("updateVaultItem", error, "Unable to update the item.");
  }
  if (!data) {
    return { ok: false, message: "Item not found." };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(data as VaultItemRow) };
}

/** Flip the favorite flag and return the updated item. */
export async function toggleVaultItemFavorite(
  id: string,
): Promise<VaultItemResult> {
  const parsedId = VaultItemIdSchema.safeParse(id);
  if (!parsedId.success) {
    return validationFailure("toggleVaultItemFavorite", parsedId.error);
  }

  const userId = await requireUserId();
  if (!userId) return UNAUTHORIZED;

  const supabase = await createClient();
  const { data: current, error: readError } = await supabase
    .from("vault_items")
    .select("favorite")
    .eq("id", parsedId.data)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (readError) {
    return actionFailure(
      "toggleVaultItemFavorite(read)",
      readError,
      "Unable to update the item.",
    );
  }
  if (!current) {
    return { ok: false, message: "Item not found." };
  }

  const { data, error } = await supabase
    .from("vault_items")
    .update({ favorite: !current.favorite })
    .eq("id", parsedId.data)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select(VAULT_ITEM_SELECT)
    .maybeSingle();

  if (error) {
    return actionFailure(
      "toggleVaultItemFavorite",
      error,
      "Unable to update the item.",
    );
  }
  if (!data) {
    return { ok: false, message: "Item not found." };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(data as VaultItemRow) };
}

/** Soft-delete: move an active item into the trash. */
export async function trashVaultItem(id: string): Promise<VaultItemResult> {
  const parsedId = VaultItemIdSchema.safeParse(id);
  if (!parsedId.success) {
    return validationFailure("trashVaultItem", parsedId.error);
  }

  const userId = await requireUserId();
  if (!userId) return UNAUTHORIZED;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vault_items")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", parsedId.data)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select(VAULT_ITEM_SELECT)
    .maybeSingle();

  if (error) {
    return actionFailure(
      "trashVaultItem",
      error,
      "Could not move the item to trash.",
    );
  }
  if (!data) {
    return { ok: false, message: "Item not found." };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(data as VaultItemRow) };
}

/** Restore a trashed item back into the active vault. */
export async function restoreVaultItem(id: string): Promise<VaultItemResult> {
  const parsedId = VaultItemIdSchema.safeParse(id);
  if (!parsedId.success) {
    return validationFailure("restoreVaultItem", parsedId.error);
  }

  const userId = await requireUserId();
  if (!userId) return UNAUTHORIZED;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vault_items")
    .update({ deleted_at: null })
    .eq("id", parsedId.data)
    .eq("user_id", userId)
    .not("deleted_at", "is", null)
    .select(VAULT_ITEM_SELECT)
    .maybeSingle();

  if (error) {
    return actionFailure("restoreVaultItem", error, "Could not restore the item.");
  }
  if (!data) {
    return { ok: false, message: "Item not found." };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(data as VaultItemRow) };
}

/** Permanently delete a trashed item. */
export async function deleteVaultItemForever(id: string): Promise<VaultResult> {
  const parsedId = VaultItemIdSchema.safeParse(id);
  if (!parsedId.success) {
    return validationFailure("deleteVaultItemForever", parsedId.error);
  }

  const userId = await requireUserId();
  if (!userId) return { ok: false, message: UNAUTHORIZED_MESSAGE };

  const supabase = await createClient();
  const { error } = await supabase
    .from("vault_items")
    .delete()
    .eq("id", parsedId.data)
    .eq("user_id", userId)
    .not("deleted_at", "is", null);

  if (error) {
    console.error("[vault-actions] deleteVaultItemForever", error);
    return { ok: false, message: "Unable to delete the item." };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

/** Remove a single tag from an item and return the updated row. */
export async function removeVaultItemTag(
  id: string,
  tag: string,
): Promise<VaultItemResult> {
  const parsedId = VaultItemIdSchema.safeParse(id);
  if (!parsedId.success) {
    return validationFailure("removeVaultItemTag", parsedId.error);
  }
  const parsedTag = VaultItemTagSchema.safeParse(tag);
  if (!parsedTag.success) {
    return validationFailure("removeVaultItemTag", parsedTag.error);
  }

  const userId = await requireUserId();
  if (!userId) return UNAUTHORIZED;

  const supabase = await createClient();
  const { data: current, error: readError } = await supabase
    .from("vault_items")
    .select("tags")
    .eq("id", parsedId.data)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (readError) {
    return actionFailure(
      "removeVaultItemTag(read)",
      readError,
      "Unable to update the item.",
    );
  }
  if (!current) {
    return { ok: false, message: "Item not found." };
  }

  const nextTags = ((current.tags ?? []) as string[]).filter(
    (t) => t !== parsedTag.data,
  );

  const { data, error } = await supabase
    .from("vault_items")
    .update({ tags: nextTags })
    .eq("id", parsedId.data)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select(VAULT_ITEM_SELECT)
    .maybeSingle();

  if (error) {
    return actionFailure(
      "removeVaultItemTag",
      error,
      "Unable to update the item.",
    );
  }
  if (!data) {
    return { ok: false, message: "Item not found." };
  }

  revalidatePath("/dashboard");
  return { ok: true, item: rowToVaultItem(data as VaultItemRow) };
}
