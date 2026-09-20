"use client";

import Link from "next/link";
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

import type { NavKey } from "@/components/dashboard/data";
import { cn } from "@/lib/utils";

import { VaultLogo } from "@/components/landing/brand-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";

type NavItem = {
  key: NavKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type DashboardSidebarProps = {
  counts: Record<NavKey, number>;
  activeNav: NavKey;
  onNavChange: (nav: NavKey) => void;
};

const primaryNav: NavItem[] = [
  { key: "all", label: "All Items", icon: KeyRoundIcon },
  { key: "favorites", label: "Favorites", icon: StarIcon },
  { key: "categories", label: "Categories", icon: FolderIcon },
  { key: "tags", label: "Tags", icon: TagIcon },
  { key: "trash", label: "Trash", icon: Trash2Icon },
];

const secondaryNav = [
  { label: "Generator", icon: WandSparklesIcon },
  { label: "Import / Export", icon: ArrowLeftRightIcon },
  { label: "Settings", icon: SettingsIcon },
];

export function DashboardSidebar({
  activeNav,
  onNavChange,
  counts,
}: DashboardSidebarProps) {
  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="offcanvas"
      className="border-r"
    >
      <SidebarHeader className="h-16 shrink-0 flex-row items-center px-6">
        <Link
          href="/"
          aria-label="Vaultly home"
          className="flex items-center gap-2"
        >
          <VaultLogo className="text-lg" />
          <Badge variant="secondary">v1.0.0</Badge>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-6">
        <nav className="flex flex-col gap-1" aria-label="Vault sections">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.key;
            return (
              <Button
                key={item.key}
                variant="ghost"
                data-active={active}
                onClick={() => onNavChange(item.key)}
                className={cn(
                  "justify-start gap-2.5 font-sans",
                  active &&
                    "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                )}
              >
                <Icon className="size-4" />
                {item.label}
                <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                  {counts[item.key]}
                </span>
              </Button>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <nav className="flex flex-col gap-1" aria-label="Tools">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() =>
                  toast.add({
                    title: `${item.label} coming soon`,
                    description: "This tool is not available in the demo yet.",
                    type: "info",
                  })
                }
                className="justify-start gap-2.5 font-sans"
              >
                <Icon className="size-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
}
