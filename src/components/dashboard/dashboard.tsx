"use client";

import { AddItemSheet } from "@/components/dashboard/add-item-sheet";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DeleteItemDialog } from "@/components/dashboard/delete-item-dialog";
import { EditItemSheet } from "@/components/dashboard/edit-item-sheet";
import { PasswordsPanel } from "@/components/dashboard/passwords-panel";
import { ViewItemSheet } from "@/components/dashboard/view-item-sheet";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useDashboard } from "@/hooks/use-dashboard";

export function Dashboard() {
  // All vault state and handlers live in useDashboard — this component is
  // purely presentational wiring.
  const {
    items,
    trash,
    counts,
    activeNav,
    setActiveNav,
    viewItem,
    editItem,
    addItemState,
    deleteTarget,
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
  } = useDashboard();

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
