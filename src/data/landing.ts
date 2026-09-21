// Landing / marketing static data — nav + footer links, section content, and
// the decorative app-mockup rows. Kept at module level so nothing is
// re-created per render (rerender-memo-with-default-value /
// server-hoist-static-io). Icon components are plain functions, so these
// exports remain server-component safe.

import {
  FileSearchIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  KeyRoundIcon,
  LockIcon,
  LockKeyholeIcon,
  MonitorSmartphoneIcon,
  NotebookPenIcon,
  ShieldCheckIcon,
  StarIcon,
  TagIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";

import {
  DiscordIcon,
  GitHubIcon,
  NotionIcon,
  ProductHuntIcon,
  SupabaseIcon,
  VercelIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/landing/brand-icons";

// Brand marks are plain SVG function components (see landing/brand-icons).
type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// ── Site header / footer ─────────────────────────────────────────────────

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#get-started" },
  { label: "FAQ", href: "#faq" },
];

export const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "GitHub", href: "#" },
];

export const socialLinks: { label: string; icon: IconComponent; href: string }[] =
  [
    { label: "GitHub", icon: GitHubIcon, href: "#" },
    { label: "X", icon: XIcon, href: "#" },
    { label: "Discord", icon: DiscordIcon, href: "#" },
    { label: "YouTube", icon: YouTubeIcon, href: "#" },
  ];

// ── Trusted logos ────────────────────────────────────────────────────────

export const trustedBrands: { name: string; icon: IconComponent }[] = [
  { name: "Product Hunt", icon: ProductHuntIcon },
  { name: "GitHub", icon: GitHubIcon },
  { name: "Vercel", icon: VercelIcon },
  { name: "Supabase", icon: SupabaseIcon },
  { name: "Notion", icon: NotionIcon },
];

// ── Features section ─────────────────────────────────────────────────────

export const features: {
  title: string;
  description: string;
  icon: LucideIcon;
  tint: string;
}[] = [
  {
    title: "Secure Passwords",
    description:
      "Store and auto-fill your passwords safely with end-to-end encryption.",
    icon: LockIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "Rich Notes",
    description: "Keep your ideas, notes, and important information organized.",
    icon: FileTextIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "File Storage",
    description: "Upload and store files, documents, and images securely.",
    icon: FolderIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "Categories & Tags",
    description: "Organize everything your way with categories and tags.",
    icon: TagIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "Favorites",
    description: "Quickly access your most important items.",
    icon: StarIcon,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "Multi-Device Sync",
    description: "Access your vault on all your devices, anytime, anywhere.",
    icon: MonitorSmartphoneIcon,
    tint: "bg-primary/10 text-primary",
  },
];

// ── Security section ─────────────────────────────────────────────────────

export const securityPoints = [
  "End-to-end encryption",
  "Zero-knowledge architecture",
  "Open source & transparent",
  "You own your data",
];

export const securityFloatingCards: {
  label: [string, string];
  icon: LucideIcon;
  tint: string;
  position: string;
}[] = [
  {
    label: ["Encrypted", "Data"],
    icon: ShieldCheckIcon,
    tint: "bg-primary/10 text-primary",
    position: "left-0 top-6 sm:top-10",
  },
  {
    label: ["You Control", "Your Keys"],
    icon: KeyRoundIcon,
    tint: "bg-primary/10 text-primary",
    position: "right-0 top-20 sm:top-24",
  },
  {
    label: ["Private &", "Secure"],
    icon: LockIcon,
    tint: "bg-primary/10 text-primary",
    position: "left-4 bottom-24 sm:bottom-28",
  },
  {
    label: ["Open Source", "& Auditable"],
    icon: FileSearchIcon,
    tint: "bg-primary/10 text-primary",
    position: "right-2 bottom-8 sm:bottom-10",
  },
];

// ── Testimonials ─────────────────────────────────────────────────────────

export const testimonials = [
  {
    quote:
      "Vaultly has completely simplified how I manage my digital life. Clean, fast, and super secure!",
    name: "Priya S.",
    role: "Student",
    initials: "PS",
  },
  {
    quote:
      "The open source approach gives me confidence. Finally a password manager I can trust.",
    name: "Aman Verma",
    role: "Developer",
    initials: "AV",
  },
  {
    quote: "Simple, beautiful, and does everything I need. Highly recommended!",
    name: "Neha K.",
    role: "Freelancer",
    initials: "NK",
  },
];

// ── FAQ ──────────────────────────────────────────────────────────────────

export const faqs = [
  {
    question: "Is Vaultly really free?",
    answer:
      "Yes! Vaultly is completely free and open source. All core features — passwords, notes, files, and sync — are available at no cost, forever.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your data is protected with end-to-end encryption using a zero-knowledge architecture. Only you hold your master key — we can never read your vault.",
  },
  {
    question: "Can I access Vaultly on multiple devices?",
    answer:
      "Absolutely. Vaultly syncs securely across web, desktop, and mobile, so your vault is always up to date wherever you are.",
  },
  {
    question: "Is Vaultly open source?",
    answer:
      "Yes, the entire codebase is open source and auditable by anyone. You can inspect, build, and even self-host Vaultly yourself.",
  },
  {
    question: "What kind of files can I store?",
    answer:
      "You can store any file type — documents, images, videos, and more — encrypted and organized with categories and tags.",
  },
];

// ── Hero app mockup (decorative) ─────────────────────────────────────────

export const mockupSidebarItems: {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  count?: number;
}[] = [
  { label: "All items", icon: FolderIcon, active: true, count: 5 },
  { label: "Favorites", icon: StarIcon },
  { label: "Categories", icon: TagIcon },
  { label: "Tags", icon: TagIcon },
  { label: "Trash", icon: Trash2Icon },
];

export const mockupQuickActions: {
  label: string;
  icon: LucideIcon;
  tint: string;
}[] = [
  {
    label: "Add Password",
    icon: KeyRoundIcon,
    tint: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Add Note",
    icon: NotebookPenIcon,
    tint: "bg-amber-500/10 text-amber-600",
  },
  {
    label: "Upload File",
    icon: UploadIcon,
    tint: "bg-sky-500/10 text-sky-600",
  },
  {
    label: "Create Category",
    icon: FolderPlusIcon,
    tint: "bg-violet-500/10 text-violet-600",
  },
];

export const mockupRecentItems: {
  name: string;
  detail: string;
  icon: LucideIcon;
  tint: string;
  badge: string;
  badgeTint: string;
  time: string;
}[] = [
  {
    name: "Gmail",
    detail: "rahul@mail.com",
    icon: LockKeyholeIcon,
    tint: "bg-red-500/10 text-red-500",
    badge: "Password",
    badgeTint: "bg-emerald-500/10 text-emerald-600",
    time: "2h ago",
  },
  {
    name: "Project Notes",
    detail: "ideas and planning",
    icon: NotebookPenIcon,
    tint: "bg-amber-500/10 text-amber-600",
    badge: "Note",
    badgeTint: "bg-amber-500/10 text-amber-600",
    time: "5h ago",
  },
  {
    name: "Design Files",
    detail: "3 items",
    icon: FolderIcon,
    tint: "bg-violet-500/10 text-violet-600",
    badge: "File",
    badgeTint: "bg-sky-500/10 text-sky-600",
    time: "1d ago",
  },
  {
    name: "Bank Account",
    detail: "****1234",
    icon: LockKeyholeIcon,
    tint: "bg-emerald-500/10 text-emerald-600",
    badge: "Password",
    badgeTint: "bg-emerald-500/10 text-emerald-600",
    time: "2d ago",
  },
];
