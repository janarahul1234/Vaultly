"use client";

import { useCallback, useMemo, useState } from "react";

import { AddItemSheet } from "@/components/dashboard/add-item-sheet";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DeleteItemDialog } from "@/components/dashboard/delete-item-dialog";
import { EditItemSheet } from "@/components/dashboard/edit-item-sheet";
import { PasswordsPanel } from "@/components/dashboard/passwords-panel";
import { ViewItemSheet } from "@/components/dashboard/view-item-sheet";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";

import { formatVaultDate, vaultItems } from "@/components/dashboard/data";
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

export function Dashboard() {
  // Single state object so trash moves stay one pure functional update —
  // safe under Strict Mode double-invocation (rerender-functional-setstate).
  const [vault, setVault] = useState({
    items: vaultItems as VaultItem[],
    trash: [] as VaultItem[],
  });
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

  const toggleFavorite = useCallback((id: string) => {
    setVault((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item,
      ),
    }));
  }, []);

  const moveToTrash = useCallback((id: string) => {
    setVault((prev) => {
      const target = prev.items.find((item) => item.id === id);
      if (!target) return prev;
      return {
        items: prev.items.filter((item) => item.id !== id),
        trash: [target, ...prev.trash],
      };
    });
    toast.add({
      title: "Moved to trash",
      description: "You can restore the item from the Trash section.",
      type: "success",
    });
  }, []);

  const restoreItem = useCallback((id: string) => {
    setVault((prev) => {
      const target = prev.trash.find((item) => item.id === id);
      if (!target) return prev;
      return {
        items: [...prev.items, target].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
        trash: prev.trash.filter((item) => item.id !== id),
      };
    });
    toast.add({ title: "Item restored", type: "success" });
  }, []);

  const deleteForever = useCallback((id: string) => {
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

  // Every destructive delete funnels through the confirmation dialog —
  // the actual state move only happens once the user confirms.
  const requestDelete = useCallback(
    (item: VaultItem, mode: DeleteMode) => {
      setDeleteTarget({ item, mode });
    },
    [],
  );

  const closeDeleteDialog = useCallback((open: boolean) => {
    if (!open) setDeleteTarget(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.mode === "trash") {
      moveToTrash(deleteTarget.item.id);
    } else {
      deleteForever(deleteTarget.item.id);
    }
    setDeleteTarget(null);
  }, [deleteTarget, moveToTrash, deleteForever]);

  const removeTag = useCallback((id: string, tag: string) => {
    setVault((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id
          ? { ...item, tags: item.tags.filter((t) => t !== tag) }
          : item,
      ),
    }));
  }, []);

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

  const selectAddItemType = useCallback(
    (type: VaultFormType) => {
      setAddItemState((prev) => ({ ...prev, type }));
    },
    [],
  );

  const saveItem = useCallback((draft: ItemDraft) => {
    const nowLabel = formatVaultDate(new Date());
    const item: VaultItem = {
      id: `item-${Date.now()}`,
      name: draft.name,
      username: draft.username,
      website: draft.website,
      category: draft.category ?? "Personal",
      tags: draft.tags,
      type: draft.type,
      favorite: false,
      updatedAt: 0,
      updatedLabel: "Just now",
      iconKey: "generic",
      password: draft.password || undefined,
      notes: draft.notes || undefined,
      createdAt: nowLabel,
      updatedAtLabel: nowLabel,
    };
    setVault((prev) => ({
      ...prev,
      items: [...prev.items, item].sort((a, b) => a.name.localeCompare(b.name)),
    }));
    setAddItemState((prev) => ({ ...prev, open: false }));
    toast.add({
      title: "Item saved",
      description: `${draft.name} was added to your vault.`,
      type: "success",
    });
  }, []);

  const saveEdit = useCallback((id: string, draft: ItemEditDraft) => {
    const nowLabel = formatVaultDate(new Date());
    // One pure update — merge the edit and re-sort together so a rename
    // keeps the alphabetical list coherent (rerender-functional-setstate).
    setVault((prev) => ({
      ...prev,
      items: prev.items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                name: draft.name,
                username: draft.username,
                website: draft.website,
                category: draft.category,
                tags: draft.tags,
                type: draft.type,
                password: draft.password || undefined,
                notes: draft.notes || undefined,
                updatedAtLabel: nowLabel,
              }
            : item,
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
    setEditItemId(null);
    toast.add({
      title: "Changes saved",
      description: `${draft.name} was updated.`,
      type: "success",
    });
  }, []);

  // SidebarProvider is a flex ROW wrapper: the sidebar rail sits beside a
  // column that holds the full-width top bar and the main content.
  return (
    <SidebarProvider className="min-h-svh font-headings">
      <DashboardSidebar
        counts={counts}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader items={items} />

        <div className="flex min-w-0 flex-1">
          <PasswordsPanel
            items={items}
            trash={trash}
            activeNav={activeNav}
            onToggleFavorite={toggleFavorite}
            onTrash={requestTrashById}
            onRestore={restoreItem}
            onDeleteForever={requestForeverById}
            onAddItem={openAddItem}
            onView={openViewItem}
            onEdit={openEditItem}
          />
        </div>
      </div>

      <ViewItemSheet
        open={!!viewItem}
        onOpenChange={closeViewItem}
        item={viewItem}
        onRemoveTag={removeTag}
        onEdit={openEditItem}
      />

      <EditItemSheet
        open={!!editItem}
        onOpenChange={closeEditItem}
        item={editItem}
        onSave={saveEdit}
        onDelete={requestTrashById}
      />

      <DeleteItemDialog
        item={deleteTarget?.item ?? null}
        open={!!deleteTarget}
        onOpenChange={closeDeleteDialog}
        onConfirm={confirmDelete}
        title={deleteTarget?.mode === "forever" ? "Delete forever?" : undefined}
        actionLabel={
          deleteTarget?.mode === "forever" ? "Delete forever" : undefined
        }
      />

      <AddItemSheet
        open={addItemState.open}
        onOpenChange={closeAddItem}
        itemType={addItemState.type}
        onItemTypeChange={selectAddItemType}
        onSave={saveItem}
      />
    </SidebarProvider>
  );
}
