"use client";

import { BellIcon } from "lucide-react";

import { DashboardSearch } from "@/components/dashboard/dashboard-search";
import { ProfileMenu } from "@/components/dashboard/profile-menu";
import { ModeToggle } from "@/components/landing/mode-toggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";

import type { DashboardHeaderProps } from "@/types/dashboard";

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform);

export function DashboardHeader({ items }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-16 items-center gap-2 px-4 md:gap-6 md:px-6">
        <SidebarTrigger size="icon" className="-ml-2 shrink-0 md:hidden" />

        <div className="mx-auto flex w-full max-w-lg min-w-0 flex-1">
          <DashboardSearch items={items} shortcut={isMac ? "⌘K" : "Ctrl K"} />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <ModeToggle />

          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative"
            onClick={() => {
              toast.add({
                title: `Notifications coming soon`,
                description: "This tool is not available in the demo yet.",
                type: "info",
              });
            }}
          >
            <BellIcon />
            <span className="absolute top-1.5 right-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
          </Button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
