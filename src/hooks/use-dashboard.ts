"use client";

import { useCallback, useMemo, useState } from "react";

import { toast } from "@/components/ui/toast";
import {
  createVaultItem,
  deleteVaultItemForever,
  removeVaultItemTag,
  restoreVaultItem,
  toggleVaultItemFavorite,
  trashVaultItem,
  updateVaultItem,
} from "@/lib/supabase/vault-actions";
import type { VaultData } from "@/lib/supabase/vault-queries";
import type {
  AddItemState,
  DeleteMode,
  DeleteTarget,
  NavKey,
} from "@/types/dashboard";
import type {
  ItemDraft,
  ItemEditDraft,
  VaultFormType,
  VaultItem,
  VaultItemType,
} from "@/types/password";

// Alphabetical ordering used whenever the list membership changes so a rename
// or a restore keeps the table coherent.
function byName(a: VaultItem, b: VaultItem) {
  return a.name.localeCompare(b.name);
}

export function useDashboard(initial: VaultData) {
  // Seeded once from the Server Component's data. Every mutation awaits its
  // Server Action and reconciles from the authoritative returned row, so this
  // client state stays consistent with Postgres without a re-read. Lazy init
  // avoids rebuilding the object on every render (rerender-lazy-state-init).
  const [vault, setVault] = useState(() => ({
    items: initial.items,
    trash: initial.trash,
  }));
  const { items, trash } = vault;
  const [activeNav, setActiveNav] = useState<NavKey>("all");
  const [addItemState, setAddItemState] = useState<AddItemState>({
    open: false,
    type: "login",
  });
  const [viewItemId, setViewItemId] = useState<string | null>(null);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const counts = useMemo<Record<NavKey, number>>(
    () => ({
      all: items.length,
      favorites: items.filter((item) => item.favorite).length,
      categories: new Set(items.map((item) => item.category)).size,
      tags: new Set(items.flatMap((item) => item.tags)).size,
      trash: trash.length,
    }),
    [items, trash],
  );

  // Replaces a single active item with its server-authored successor, leaving
  // order untouched (used by favorite/tag edits).
  const upsertItem = useCallback((item: VaultItem) => {
    setVault((prev) => ({
      ...prev,
      items: prev.items.map((x) => (x.id === item.id ? item : x)),
    }));
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    const result = await toggleVaultItemFavorite(id);
    if (result.ok) {
      upsertItem(result.item);
    } else {
      toast.add({ title: "Update failed", description: result.message, type: "error" });
    }
  }, [upsertItem]);

  const moveToTrash = useCallback(async (id: string) => {
    const result = await trashVaultItem(id);
    if (!result.ok) {
      toast.add({ title: "Could not move to trash", description: result.message, type: "error" });
      return;
    }
    setVault((prev) => ({
      items: prev.items.filter((item) => item.id !== id),
      trash: [result.item, ...prev.trash],
    }));
    toast.add({
      title: "Moved to trash",
      description: "You can restore the item from the Trash section.",
      type: "success",
    });
  }, []);

  const restoreItem = useCallback(async (id: string) => {
    const result = await restoreVaultItem(id);
    if (!result.ok) {
      toast.add({ title: "Could not restore", description: result.message, type: "error" });
      return;
    }
    setVault((prev) => ({
      items: [...prev.items, result.item].sort(byName),
      trash: prev.trash.filter((item) => item.id !== id),
    }));
    toast.add({ title: "Item restored", type: "success" });
  }, []);

  const deleteForever = useCallback(async (id: string) => {
    const result = await deleteVaultItemForever(id);
    if (!result.ok) {
      toast.add({ title: "Delete failed", description: result.message, type: "error" });
      return;
    }
    setVault((prev) => ({
      ...prev,
      trash: prev.trash.filter((item) => item.id !== id),
    }));
    toast.add({
      title: "Deleted forever",
      description: "This item has been permanently removed.",
      type: "error",
    });
  }, []);

  // Every destructive delete funnels through the confirmation dialog — the
  // actual server call only happens once the user confirms.
  const requestDelete = useCallback((item: VaultItem, mode: DeleteMode) => {
    setDeleteTarget({ item, mode });
  }, []);

  const closeDeleteDialog = useCallback((open: boolean) => {
    if (!open) setDeleteTarget(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    const { item, mode } = deleteTarget;
    setDeleteTarget(null);
    if (mode === "trash") void moveToTrash(item.id);
    else void deleteForever(item.id);
  }, [deleteTarget, moveToTrash, deleteForever]);

  const removeTag = useCallback(async (id: string, tag: string) => {
    const result = await removeVaultItemTag(id, tag);
    if (result.ok) {
      upsertItem(result.item);
    } else {
      toast.add({ title: "Could not remove tag", description: result.message, type: "error" });
    }
  }, [upsertItem]);

  const openViewItem = useCallback((id: string) => setViewItemId(id), []);

  const closeViewItem = useCallback((open: boolean) => {
    if (!open) setViewItemId(null);
  }, []);

  // Editing replaces the view sheet so a single record is never open twice.
  const openEditItem = useCallback((id: string) => {
    setViewItemId(null);
    setEditItemId(id);
  }, []);

  // The list menu and edit sheet delete through the same confirmation.
  const requestTrashById = useCallback(
    (id: string) => {
      const item = items.find((x) => x.id === id);
      if (item) requestDelete(item, "trash");
    },
    [items, requestDelete],
  );

  const requestForeverById = useCallback(
    (id: string) => {
      const item = trash.find((x) => x.id === id);
      if (item) requestDelete(item, "forever");
    },
    [trash, requestDelete],
  );

  const closeEditItem = useCallback((open: boolean) => {
    if (!open) setEditItemId(null);
  }, []);

  // Derived during render, not state — no effect needed
  // (rerender-derived-state-no-effect).
  const viewItem = useMemo(
    () => items.find((item) => item.id === viewItemId) ?? null,
    [items, viewItemId],
  );

  const editItem = useMemo(
    () => items.find((item) => item.id === editItemId) ?? null,
    [items, editItemId],
  );

  // "Card" falls back to the Login tab — the sheet only exposes the two
  // editors shown in the design.
  const openAddItem = useCallback((type: VaultItemType) => {
    setAddItemState({ open: true, type: type === "note" ? "note" : "login" });
  }, []);

  const closeAddItem = useCallback((open: boolean) => {
    setAddItemState((prev) => ({ ...prev, open }));
  }, []);

  const selectAddItemType = useCallback((type: VaultFormType) => {
    setAddItemState((prev) => ({ ...prev, type }));
  }, []);

  const saveItem = useCallback(async (draft: ItemDraft) => {
    const result = await createVaultItem(draft);
    if (!result.ok) {
      toast.add({ title: "Could not save item", description: result.message, type: "error" });
      return;
    }
    setVault((prev) => ({
      ...prev,
      items: [...prev.items, result.item].sort(byName),
    }));
    setAddItemState((prev) => ({ ...prev, open: false }));
    toast.add({
      title: "Item saved",
      description: `${result.item.name} was added to your vault.`,
      type: "success",
    });
  }, []);

  const saveEdit = useCallback(async (id: string, draft: ItemEditDraft) => {
    const result = await updateVaultItem(id, draft);
    if (!result.ok) {
      toast.add({ title: "Could not save changes", description: result.message, type: "error" });
      return;
    }
    setVault((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? result.item : item)).sort(byName),
    }));
    setEditItemId(null);
    toast.add({
      title: "Changes saved",
      description: `${result.item.name} was updated.`,
      type: "success",
    });
  }, []);

  return {
    // Vault data
    items,
    trash,
    counts,
    // Navigation
    activeNav,
    setActiveNav,
    // View / edit / add sheets
    viewItem,
    editItem,
    addItemState,
    // Delete dialog
    deleteTarget,
    // Actions
    toggleFavorite,
    requestTrashById,
    requestForeverById,
    restoreItem,
    openViewItem,
    closeViewItem,
    openEditItem,
    closeEditItem,
    openAddItem,
    closeAddItem,
    selectAddItemType,
    saveItem,
    saveEdit,
    removeTag,
    closeDeleteDialog,
    confirmDelete,
  };
}
