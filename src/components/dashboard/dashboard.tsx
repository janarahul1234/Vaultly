"use client";

import { useCallback, useMemo, useState } from "react";
import { AddItemSheet, type ItemDraft } from "@/components/dashboard/add-item-sheet";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  DashboardSidebar,
  type NavCounts,
} from "@/components/dashboard/dashboard-sidebar";
import { PasswordsPanel } from "@/components/dashboard/passwords-panel";
import {
  vaultCapacity,
  vaultItems,
  type NavKey,
  type VaultItem,
  type VaultItemType,
} from "@/components/dashboard/data";
import { toast } from "@/components/ui/toast";

type AddItemState = {
  open: boolean;
  type: Exclude<VaultItemType, "card">;
};

export function Dashboard() {
  // Single state object so trash moves stay one pure functional update —
  // safe under Strict Mode double-invocation (rerender-functional-setstate).
  const [vault, setVault] = useState({
    items: vaultItems as VaultItem[],
    trash: [] as VaultItem[],
  });
  const { items, trash } = vault;
  const [activeNav, setActiveNav] = useState<NavKey>("all");
  const [vaultLocked, setVaultLocked] = useState(true);
  const [addItemState, setAddItemState] = useState<AddItemState>({
    open: false,
    type: "login",
  });

  const counts = useMemo<NavCounts>(
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

  // "Card" falls back to the Login tab — the sheet only exposes the two
  // editors shown in the design.
  const openAddItem = useCallback((type: VaultItemType) => {
    setAddItemState({ open: true, type: type === "note" ? "note" : "login" });
  }, []);

  const closeAddItem = useCallback((open: boolean) => {
    setAddItemState((prev) => ({ ...prev, open }));
  }, []);

  const selectAddItemType = useCallback(
    (type: Exclude<VaultItemType, "card">) => {
      setAddItemState((prev) => ({ ...prev, type }));
    },
    [],
  );

  const saveItem = useCallback((draft: ItemDraft) => {
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
    };
    setVault((prev) => ({
      ...prev,
      items: [...prev.items, item].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }));
    setAddItemState((prev) => ({ ...prev, open: false }));
    toast.add({
      title: "Item saved",
      description: `${draft.name} was added to your vault.`,
      type: "success",
    });
  }, []);

  // Toast fires outside the state updater — side effects inside an updater
  // run twice under Strict Mode and trigger setState-during-render errors.
  const toggleLock = useCallback(() => {
    const next = !vaultLocked;
    setVaultLocked(next);
    toast.add({
      title: next ? "Vault locked" : "Vault unlocked",
      description: next
        ? "Your data is encrypted again."
        : "Decryption started for this session.",
      type: "success",
    });
  }, [vaultLocked]);

  return (
    <div className="flex min-h-svh flex-col font-sans">
      <DashboardHeader items={items} />
      <div className="flex w-full flex-1">
        <DashboardSidebar
          activeNav={activeNav}
          onNavChange={setActiveNav}
          counts={counts}
          vaultLocked={vaultLocked}
          onToggleLock={toggleLock}
          usedItems={items.length}
          capacity={vaultCapacity}
        />
        <PasswordsPanel
          items={items}
          trash={trash}
          activeNav={activeNav}
          onToggleFavorite={toggleFavorite}
          onTrash={moveToTrash}
          onRestore={restoreItem}
          onDeleteForever={deleteForever}
          onAddItem={openAddItem}
        />
      </div>
      <AddItemSheet
        open={addItemState.open}
        onOpenChange={closeAddItem}
        itemType={addItemState.type}
        onItemTypeChange={selectAddItemType}
        onSave={saveItem}
      />
    </div>
  );
}
