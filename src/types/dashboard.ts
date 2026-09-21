// Dashboard navigation + component props for the vault workspace.

import type { ComponentType, ReactElement } from "react";

import type {
  ItemDraft,
  ItemEditDraft,
  VaultFormType,
  VaultIconKey,
  VaultItem,
  VaultItemType,
} from "@/types/password";

/** Sidebar navigation sections. */
export type NavKey = "all" | "favorites" | "categories" | "tags" | "trash";

/** Item counts per navigation section. */
export type NavCounts = Record<NavKey, number>;

/** Heading copy for the active navigation section. */
export type NavHeading = {
  title: string;
  subtitle: string;
};

/** Sidebar navigation entry. */
export type NavItem = {
  key: NavKey;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

/** Callback targeting a vault item by id. */
export type VaultIdHandler = (id: string) => void;

/** Removes a tag from a specific vault item. */
export type VaultTagRemover = (id: string, tag: string) => void;

/** Controlled open/close props shared by sheets and dialogs. */
export type SheetControlProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type DashboardSidebarProps = {
  counts: NavCounts;
  activeNav: NavKey;
  onNavChange: (nav: NavKey) => void;
};

export type DashboardHeaderProps = {
  items: VaultItem[];
};

export type DashboardSearchProps = {
  items: VaultItem[];
  shortcut?: string;
};

export type ItemIconProps = {
  iconKey?: VaultIconKey;
  website?: string;
  className?: string;
};

export type ItemActionsDropdownProps = {
  item: VaultItem;
  onView: VaultIdHandler;
  onEdit: VaultIdHandler;
  onToggleFavorite: VaultIdHandler;
  onTrash: VaultIdHandler;
};

export type FilterSelectProps = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  options: readonly string[];
  value: string;
  onValueChange: (value: string) => void;
};

export type PasswordsPanelProps = {
  items: VaultItem[];
  trash: VaultItem[];
  activeNav: NavKey;
  onToggleFavorite: VaultIdHandler;
  onTrash: VaultIdHandler;
  onRestore: VaultIdHandler;
  onDeleteForever: VaultIdHandler;
  onAddItem: (type: VaultItemType) => void;
  onView: VaultIdHandler;
  onEdit: VaultIdHandler;
};

/** Add-sheet open state — which tab to preselect when it opens. */
export type AddItemState = {
  open: boolean;
  type: VaultFormType;
};

export type AddItemSheetProps = SheetControlProps & {
  itemType: VaultFormType;
  onItemTypeChange: (type: VaultFormType) => void;
  onSave: (draft: ItemDraft) => void;
};

/** Deletion kind — move to trash or erase permanently. */
export type DeleteMode = "trash" | "forever";

/** Item awaiting delete confirmation (null when the dialog is closed). */
export type DeleteTarget = {
  item: VaultItem;
  mode: DeleteMode;
} | null;

export type DeleteItemDialogProps = {
  item: VaultItem | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: VaultIdHandler;
  /** Heading override — e.g. "Delete forever?" for the trash flow. */
  title?: string;
  actionLabel?: string;
  /** Optional custom trigger element; omit when the parent controls `open`. */
  trigger?: ReactElement;
};

export type ViewItemSheetProps = SheetControlProps & {
  item: VaultItem | null;
  onRemoveTag: VaultTagRemover;
  onEdit: VaultIdHandler;
};

export type ViewItemDetailProps = {
  item: VaultItem;
  onRemoveTag: VaultTagRemover;
  onEdit: VaultIdHandler;
};

/** Read-only title/username/website field (view sheet). */
export type ReadOnlyTextFieldProps = {
  id: string;
  label: string;
  value: string;
};

/** Read-only category display field (view sheet). */
export type ViewCategoryFieldProps = {
  value: string;
};

/** Removable tag chips scoped to one item (view sheet). */
export type ViewItemTagsFieldProps = {
  item: VaultItem;
  onRemoveTag: VaultTagRemover;
};

export type EditItemSheetProps = SheetControlProps & {
  item: VaultItem | null;
  onSave: (id: string, draft: ItemEditDraft) => void;
  onDelete: VaultIdHandler;
};

export type EditItemDetailProps = {
  item: VaultItem;
  onSave: (draft: ItemEditDraft) => void;
  onDelete: VaultIdHandler;
};
