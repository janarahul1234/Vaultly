// Account / auth-flow mock data — profile identity, menu links, and the
// static copy for the signup showcase and email-verification screens.
// Kept at module level so nothing is re-created per render
// (rerender-memo-with-default-value / server-hoist-static-io).

import {
  CircleHelpIcon,
  FileTextIcon,
  FolderIcon,
  HeartIcon,
  HelpCircleIcon,
  KeyRoundIcon,
  MessageCircleIcon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  UserIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ProfileMenuLink, UserAccount } from "@/types/user";

export const accountDetails: UserAccount = {
  name: "Rahul Jana",
  email: "rahul@example.com",
};

export const profileLinks: ProfileMenuLink[] = [
  {
    href: "/dashboard",
    icon: UserIcon,
    label: "My Profile",
    description: "Manage your account",
  },
  {
    href: "/dashboard",
    icon: ShieldCheckIcon,
    label: "Security",
    description: "Password, 2FA, and sessions",
  },
  {
    href: "/dashboard",
    icon: SlidersHorizontalIcon,
    label: "Preferences",
    description: "Appearance, language, and more",
  },
];

export const supportLinks: ProfileMenuLink[] = [
  {
    href: "/dashboard",
    icon: HelpCircleIcon,
    label: "Help & Support",
    description: "Docs, FAQ, and contact",
  },
  {
    href: "/dashboard",
    icon: MessageSquareTextIcon,
    label: "Give Feedback",
    description: "Help us improve",
  },
];

// ── Signup showcase ──────────────────────────────────────────────────────

export const signupPerks = [
  "End-to-end encryption",
  "Access anywhere",
  "Open source & free",
];

// Static decorative tiles for the signup showcase aside.
export const signupFloatingTiles: {
  label: string;
  icon: LucideIcon;
  tint: string;
  position: string;
}[] = [
  {
    label: "Passwords",
    icon: KeyRoundIcon,
    tint: "bg-primary/10 text-primary",
    position: "left-0 top-6 sm:left-12",
  },
  {
    label: "Notes",
    icon: FileTextIcon,
    tint: "bg-primary/15 text-primary",
    position: "right-0 top-2 sm:right-10",
  },
  {
    label: "Files",
    icon: FolderIcon,
    tint: "bg-primary/10 text-primary",
    position: "left-0 bottom-8 sm:left-6",
  },
  {
    label: "Favorites",
    icon: HeartIcon,
    tint: "bg-primary/10 text-primary",
    position: "right-0 bottom-3 sm:right-14",
  },
];

// ── Email verification ───────────────────────────────────────────────────

export const verifyEmailHelpItems = [
  {
    icon: CircleHelpIcon,
    title: "Need help?",
    description: "Visit our help center",
  },
  {
    icon: MessageCircleIcon,
    title: "Contact support",
    description: "We're here to help",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & private",
    description: "Your data is always safe",
  },
];
