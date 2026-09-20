"use client";

import Link from "next/link";
import { VaultLogo } from "@/components/landing/brand-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import type { NavKey } from "@/components/dashboard/data";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRightIcon,
  ChevronRightIcon,
  FolderIcon,
  LockKeyholeIcon,
  SettingsIcon,
  StarIcon,
  TagIcon,
  Trash2Icon,
  UnlockIcon,
  WandSparklesIcon,
  KeyRoundIcon,
} from "lucide-react";

type NavItem = {
  key: NavKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
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

export type NavCounts = Record<NavKey, number>;

export function DashboardSidebar({
  activeNav,
  onNavChange,
  counts,
  vaultLocked,
  onToggleLock,
  usedItems,
  capacity,
}: {
  activeNav: NavKey;
  onNavChange: (nav: NavKey) => void;
  counts: NavCounts;
  vaultLocked: boolean;
  onToggleLock: () => void;
  usedItems: number;
  capacity: number;
}) {
  const usagePercent = Math.min(100, Math.round((usedItems / capacity) * 100));

  // Full-height rail beside the content column (canonical shadcn split:
  // the rail owns its own logo header). Mobile: offcanvas lets the shadcn
  // Sidebar swap itself for a Sheet opened by the header's SidebarTrigger —
  // `collapsible="none"` would skip that.
  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas" className="border-r">
      <SidebarHeader className="h-16 shrink-0 flex-row items-center gap-2 border-b px-6">
        <Link
          href="/"
          aria-label="Vaultly home"
          className="flex items-center gap-2"
        >
          <VaultLogo className="text-lg" />
          <Badge variant="secondary" className="font-normal">
            Personal
          </Badge>
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

      {/* <div className="mt-auto flex flex-col gap-3 pt-6">
        <Button
          variant="outline"
          onClick={onToggleLock}
          className="h-auto w-full justify-start gap-3 rounded-xl px-3.5 py-3 text-left"
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-muted text-muted-foreground">
              {vaultLocked ? (
                <LockKeyholeIcon className="size-3.5" />
              ) : (
                <UnlockIcon className="size-3.5" />
              )}
            </AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {vaultLocked ? "Vault Locked" : "Vault Unlocked"}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {vaultLocked ? "Your data is encrypted" : "Click to lock your vault"}
            </span>
          </span>
          <ChevronRightIcon className="ms-auto size-4 shrink-0 text-muted-foreground" />
        </Button>

        <Card className="rounded-xl">
          <CardContent className="flex flex-col gap-2.5 pt-1">
            <span className="text-sm font-medium">Vault Usage</span>
            <span className="text-xs text-muted-foreground">
              {usedItems} items
            </span>
            <div className="flex items-center gap-2.5">
              <Progress
                value={usagePercent}
                aria-label="Vault usage"
                className="flex-1 gap-0"
              />
              <span className="text-xs text-muted-foreground tabular-nums">
                {usagePercent}% of {capacity}
              </span>
            </div>
          </CardContent>
        </Card>
      </div> */}
      </SidebarContent>
    </Sidebar>
  );
}
