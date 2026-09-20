// Static mock data for the Vaultly dashboard. Kept at module level so it is
// never re-created per render (rerender-memo-with-default-value /
// server-hoist-static-io).

export type VaultCategory =
  | "Work"
  | "Personal"
  | "Entertainment"
  | "Shopping"
  | "Social";

export type VaultItemType = "login" | "note" | "card";

export type VaultIconKey =
  | "github"
  | "google"
  | "notion"
  | "spotify"
  | "netflix"
  | "amazon"
  | "x"
  | "linkedin";

export type VaultItem = {
  id: string;
  name: string;
  username: string;
  website: string;
  category: VaultCategory;
  tags: string[];
  type: VaultItemType;
  favorite: boolean;
  /** Days since last update — used for sorting. */
  updatedAt: number;
  /** Human-readable relative time — used for display. */
  updatedLabel: string;
  iconKey: VaultIconKey;
};

export const vaultItems: VaultItem[] = [
  {
    id: "github",
    name: "GitHub",
    username: "rahul@vaultly.dev",
    website: "https://github.com",
    category: "Work",
    tags: ["dev", "code"],
    type: "login",
    favorite: true,
    updatedAt: 2,
    updatedLabel: "2 days ago",
    iconKey: "github",
  },
  {
    id: "google",
    name: "Google",
    username: "rahul@gmail.com",
    website: "https://accounts.google.com",
    category: "Personal",
    tags: ["email"],
    type: "login",
    favorite: false,
    updatedAt: 5,
    updatedLabel: "5 days ago",
    iconKey: "google",
  },
  {
    id: "notion",
    name: "Notion",
    username: "rahul@company.io",
    website: "https://notion.so",
    category: "Work",
    tags: ["docs", "notes"],
    type: "login",
    favorite: false,
    updatedAt: 7,
    updatedLabel: "1 week ago",
    iconKey: "notion",
  },
  {
    id: "spotify",
    name: "Spotify",
    username: "rahul@vaultly.dev",
    website: "https://spotify.com",
    category: "Personal",
    tags: ["music"],
    type: "login",
    favorite: false,
    updatedAt: 7,
    updatedLabel: "1 week ago",
    iconKey: "spotify",
  },
  {
    id: "netflix",
    name: "Netflix",
    username: "family@vaultly.dev",
    website: "https://netflix.com",
    category: "Entertainment",
    tags: ["video"],
    type: "login",
    favorite: false,
    updatedAt: 14,
    updatedLabel: "2 weeks ago",
    iconKey: "netflix",
  },
  {
    id: "amazon",
    name: "Amazon",
    username: "rahul@vaultly.dev",
    website: "https://amazon.in",
    category: "Shopping",
    tags: ["payments"],
    type: "login",
    favorite: false,
    updatedAt: 15,
    updatedLabel: "2 weeks ago",
    iconKey: "amazon",
  },
  {
    id: "x",
    name: "Twitter / X",
    username: "@rahul",
    website: "https://x.com",
    category: "Social",
    tags: ["social"],
    type: "login",
    favorite: false,
    updatedAt: 21,
    updatedLabel: "3 weeks ago",
    iconKey: "x",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    username: "rahul@vaultly.dev",
    website: "https://linkedin.com",
    category: "Work",
    tags: ["social", "career"],
    type: "login",
    favorite: false,
    updatedAt: 22,
    updatedLabel: "3 weeks ago",
    iconKey: "linkedin",
  },
];

// Data-driven category colors — Badge variants can't express per-category
// hues, so the color map lives here and is applied via className.
export const categoryStyles: Record<VaultCategory, string> = {
  Work: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Personal: "bg-primary/10 text-primary",
  Entertainment: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Shopping: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Social: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

export type NavKey = "all" | "favorites" | "categories" | "tags" | "trash";

export const navHeadings: Record<NavKey, { title: string; subtitle: string }> =
  {
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
