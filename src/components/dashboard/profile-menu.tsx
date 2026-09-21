"use client";

import Link from "next/link";
import {
  ChevronDownIcon,
  HelpCircleIcon,
  LogOutIcon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ProfileMenuLink, UserAccount } from "@/types/user";

const accountDetails: UserAccount = {
  name: "Rahul Jana",
  email: "rahul@example.com",
};

const profileLinks: ProfileMenuLink[] = [
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

const supportLinks: ProfileMenuLink[] = [
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

function MenuLink({ href, icon: Icon, label, description }: ProfileMenuLink) {
  return (
    <DropdownMenuItem render={<Link href={href} />} nativeButton={false}>
      <div className="flex items-center gap-4 p-1 group">
        <Icon className="size-6 text-muted-foreground" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate font-sans font-medium">{label}</span>
          <span className="truncate text-muted-foreground">{description}</span>
        </div>
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
          <AvatarFallback className="bg-primary/15 text-primary">
            {accountDetails.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden font-sans font-medium sm:inline">
          {accountDetails.name}
        </span>
        <ChevronDownIcon className="hidden size-4 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-80 p-2 pt-1">
        <div className="flex items-center gap-3 px-1.5 py-2">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary/15 text-base text-primary">
              {accountDetails.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-heading font-semibold">
              {accountDetails.name}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {accountDetails.email}
            </span>
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
          className="gap-4 px-3 py-2 font-sans font-medium"
        >
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
