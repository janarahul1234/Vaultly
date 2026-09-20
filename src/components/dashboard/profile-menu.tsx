"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  HelpCircleIcon,
  LogOutIcon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  UserIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const accountDetails = {
  name: "Rahul",
  email: "rahul@example.com",
  plan: "Free Plan",
};

const profileLinks = [
  {
    href: "/dashboard/profile",
    icon: UserIcon,
    label: "My Profile",
    description: "Manage your personal information",
  },
  {
    href: "/dashboard/security",
    icon: ShieldCheckIcon,
    label: "Security",
    description: "Password, 2FA, and sessions",
  },
  {
    href: "/dashboard/preferences",
    icon: SlidersHorizontalIcon,
    label: "Preferences",
    description: "Appearance, language, and more",
  },
];

const supportLinks = [
  {
    href: "https://docs.vaultly.dev",
    icon: HelpCircleIcon,
    label: "Help & Support",
    description: "Docs, FAQ, and contact",
  },
  {
    href: "https://vaultly.dev/feedback",
    icon: MessageSquareTextIcon,
    label: "Give Feedback",
    description: "Help us improve",
  },
];

function MenuLink({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
}) {
  return (
    <DropdownMenuItem
      render={<Link href={href} />}
      nativeButton={false}
      className="items-start gap-2.5 py-2"
    >
      <Icon className="mt-0.5 text-muted-foreground" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-medium">{label}</span>
        <span className="truncate text-xs font-normal text-muted-foreground">
          {description}
        </span>
      </div>
    </DropdownMenuItem>
  );
}

export function ProfileMenu() {
  return (
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
            {accountDetails.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden font-sans font-medium sm:inline">
          {accountDetails.name}
        </span>
        <ChevronDownIcon className="hidden size-4 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-80 gap-0 p-2">
        <div className="flex items-center gap-3 px-1.5 py-2">
          <Avatar size="lg">
            <AvatarFallback className="bg-violet-500/15 text-base text-violet-600 dark:text-violet-400">
              {accountDetails.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate font-semibold">
              {accountDetails.name}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {accountDetails.email}
            </span>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                {accountDetails.plan}
              </Badge>
              <Link
                href="/dashboard/billing"
                className="flex items-center text-sm font-medium text-primary"
              >
                Upgrade
                <ChevronRightIcon className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {profileLinks.map((link) => (
            <MenuLink key={link.label} {...link} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {supportLinks.map((link) => (
            <MenuLink key={link.label} {...link} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          render={<Link href="/signin" />}
          nativeButton={false}
          className="gap-2.5 py-2 font-medium"
        >
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
