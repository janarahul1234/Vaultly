"use client";

import { ModeToggle } from "@/components/landing/mode-toggle";
import { DashboardSearch } from "@/components/dashboard/dashboard-search";
import { ProfileMenu } from "@/components/dashboard/profile-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BellIcon,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { VaultItem } from "@/components/dashboard/data";

// Windows/Linux show "Ctrl K" in the search button; macOS shows "⌘K".
const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform);

const notifications = [
  { id: "n1", title: "Weak password detected", description: "Netflix · 1 hour ago" },
  { id: "n2", title: "Vault synced across devices", description: "Yesterday" },
  { id: "n3", title: "Security check complete", description: "3 days ago" },
];

export function DashboardHeader({ items }: { items: VaultItem[] }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-16 items-center gap-2 px-4 md:gap-6 md:px-6">
        <SidebarTrigger className="-ml-2 shrink-0 md:hidden" />

        <div className="mx-auto flex w-full max-w-xl min-w-0 flex-1">
          <DashboardSearch items={items} shortcut={isMac ? "⌘K" : "Ctrl K"} />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Notifications"
                  className="relative"
                />
              }
            >
              <BellIcon />
              <span className="absolute top-1.5 right-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto min-w-72">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="items-start">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {notification.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-muted-foreground">
                View all activity
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
