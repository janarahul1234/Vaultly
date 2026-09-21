// Dashboard workspace data — sidebar navigation, section headings, plan
// capacity, and the passwords-panel filter option lists. Kept at module
// level so nothing is re-created per render (rerender-memo-with-default-value
// / server-hoist-static-io). Type definitions live in @/types/dashboard.

import {
  ArrowLeftRightIcon,
  FolderIcon,
  KeyRoundIcon,
  SettingsIcon,
  StarIcon,
  TagIcon,
  Trash2Icon,
  WandSparklesIcon,
} from "lucide-react";

import type { NavHeading, NavItem, NavKey } from "@/types/dashboard";
import type { VaultTypeFilter } from "@/types/password";

export const primaryNav: NavItem[] = [
  { key: "all", label: "All Items", icon: KeyRoundIcon },
  { key: "favorites", label: "Favorites", icon: StarIcon },
  { key: "categories", label: "Categories", icon: FolderIcon },
  { key: "tags", label: "Tags", icon: TagIcon },
  { key: "trash", label: "Trash", icon: Trash2Icon },
];

export const secondaryNav: { label: string; icon: typeof SettingsIcon }[] = [
  { label: "Generator", icon: WandSparklesIcon },
  { label: "Import / Export", icon: ArrowLeftRightIcon },
  { label: "Settings", icon: SettingsIcon },
];

export const navHeadings: Record<NavKey, NavHeading> = {
  all: {
    title: "All Passwords",
    subtitle: "Manage your secure information in one place.",
  },
  favorites: {
    title: "Favorites",
    subtitle: "Items you starred for quick access.",
  },
  categories: {
    title: "Categories",
    subtitle: "Browse your vault grouped by category.",
  },
  tags: {
    title: "Tags",
    subtitle: "Browse your vault grouped by tags.",
  },
  trash: {
    title: "Trash",
    subtitle: "Items here can be restored or deleted forever.",
  },
};

// Free plan capacity — 8 demo items / 10 = 80%, matching the design mock.
export const vaultCapacity = 10;

// Passwords-panel filter dropdown options.
export const typeOptions = ["All types", "Login", "Note", "Card"] as const;
export const sortOptions = ["Name", "Recently Updated"] as const;
export const typeFilterMap: Record<(typeof typeOptions)[number], VaultTypeFilter> = {
  "All types": "all",
  Login: "login",
  Note: "note",
  Card: "card",
};
