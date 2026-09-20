"use client";

import Link from "next/link";
import { VaultLogo } from "@/components/landing/brand-icons";
import { ModeToggle } from "@/components/landing/mode-toggle";
import { DashboardSearch } from "@/components/dashboard/dashboard-search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  ChevronDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";
import type { VaultItem } from "@/components/dashboard/data";

const notifications = [
  { id: "n1", title: "Weak password detected", description: "Netflix · 1 hour ago" },
  { id: "n2", title: "Vault synced across devices", description: "Yesterday" },
  { id: "n3", title: "Security check complete", description: "3 days ago" },
];

export function DashboardHeader({ items }: { items: VaultItem[] }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-16 items-center gap-3 px-4 md:gap-6 md:px-6">
        <Link
          href="/"
          aria-label="Vaultly home"
          className="flex shrink-0 items-center gap-2"
        >
          <VaultLogo className="text-lg" />
          <Badge variant="secondary" className="hidden font-normal sm:inline-flex">
            Personal
          </Badge>
        </Link>

        <div className="mx-auto w-full max-w-xl">
          <DashboardSearch items={items} />
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

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="h-10 gap-2 px-1.5 sm:pr-2.5"
                  aria-label="Account menu"
                />
              }
            >
              <Avatar>
                <AvatarFallback className="bg-violet-500/15 text-violet-600 dark:text-violet-400">
                  R
                </AvatarFallback>
              </Avatar>
              <span className="hidden font-sans font-medium sm:inline">
                Rahul
              </span>
              <ChevronDownIcon className="hidden size-4 text-muted-foreground sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto min-w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col gap-0">
                  <span className="text-foreground">Rahul</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    rahul@vaultly.dev
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <WalletIcon /> Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                render={<Link href="/signin" />}
                nativeButton={false}
              >
                <LogOutIcon /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
