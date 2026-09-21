// Static mock data for the Vaultly dashboard. Kept at module level so it is
// never re-created per render (rerender-memo-with-default-value /
// server-hoist-static-io). Type definitions live in @/types.

import type { NavHeading, NavKey } from "@/types/dashboard";
import type { VaultCategory, VaultItem } from "@/types/password";

// "Jan 10, 2024, 3:24 PM" — the absolute format used by the details panel.
export function formatVaultDate(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const vaultItems: VaultItem[] = [
  {
    id: "github",
    name: "GitHub",
    username: "rahul@vaultly.dev",
    website: "https://github.com",
    category: "Work",
    tags: ["dev", "coding", "opensource"],
    type: "login",
    favorite: true,
    updatedAt: 2,
    updatedLabel: "2 days ago",
    iconKey: "github",
    password: "Gh!7xKp2mQ9vLr4Z",
    notes: "Personal GitHub account for open source projects.",
    createdAt: "Jan 10, 2024, 3:24 PM",
    updatedAtLabel: "Jan 12, 2024, 11:08 AM",
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
    password: "G00gle#Secure21",
    notes: "Primary personal email account.",
    createdAt: "Feb 2, 2024, 9:15 AM",
    updatedAtLabel: "Jan 10, 2024, 5:40 PM",
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
    password: "N0t!on@Work88",
    notes: "Company wiki and project docs.",
    createdAt: "Mar 14, 2024, 10:02 AM",
    updatedAtLabel: "Jan 8, 2024, 2:19 PM",
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
    password: "Sp0t!fy#Music7",
    notes: "Family plan — 4 accounts.",
    createdAt: "Apr 3, 2024, 8:47 PM",
    updatedAtLabel: "Jan 8, 2024, 9:05 AM",
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
    password: "N3tflix@Fam2024",
    notes: "Shared with family. Don't change the plan.",
    createdAt: "May 21, 2024, 7:30 PM",
    updatedAtLabel: "Dec 31, 2023, 6:12 PM",
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
    password: "Am4z0n#Shop55",
    notes: "Default delivery: home address.",
    createdAt: "Jun 8, 2024, 12:41 PM",
    updatedAtLabel: "Dec 28, 2023, 4:55 PM",
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
    password: "X!tw33t@Rahul9",
    createdAt: "Jul 19, 2024, 3:05 PM",
    updatedAtLabel: "Dec 22, 2023, 11:20 AM",
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
    password: "L!nk3dIn#Work7",
    notes: "Keep the profile updated for job roles.",
    createdAt: "Aug 2, 2024, 9:58 AM",
    updatedAtLabel: "Dec 20, 2023, 1:34 PM",
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
