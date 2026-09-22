"use client";

import Link from "next/link";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { profileLinks, supportLinks } from "@/data/user";
import { useSignOut } from "@/hooks/use-sign-out";
import { createClient } from "@/lib/supabase/client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ProfileMenuLink } from "@/types/user";

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
  const [user, setUser] = useState<User | null>(null);
  const { isPending, signOut } = useSignOut();

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user);
    });
    return () => {
      active = false;
    };
  }, []);

  // Identity comes strictly from the live Supabase session — until the user
  // resolves, the menu renders empty rather than a placeholder account.
  const email = user?.email ?? "";
  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ?? email.split("@")[0];
  const initial = (fullName || email).charAt(0).toUpperCase();

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
            {initial}
          </AvatarFallback>
        </Avatar>
        <span className="hidden font-sans font-medium sm:inline">
          {fullName}
        </span>
        <ChevronDownIcon className="hidden size-4 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-80 p-2 pt-1">
        <div className="flex items-center gap-3 px-1.5 py-2">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary/15 text-base text-primary">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-heading font-semibold">
              {fullName}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {email}
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
          disabled={isPending}
          onClick={signOut}
          className="gap-4 px-3 py-2 font-sans font-medium"
        >
          {isPending ? <Spinner /> : <LogOutIcon />}
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
